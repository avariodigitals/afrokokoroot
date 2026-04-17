"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { GalleryItem } from "@/lib/types"
import { saveGalleryItem, deleteGalleryItem } from "@/lib/actions"
import { toast } from "sonner"
import { Plus, Trash2, Pencil, Image as ImageIcon, Loader2 } from "lucide-react"
import Image from "next/image"

interface GalleryClientPageProps {
  initialItems: GalleryItem[]
}

export function GalleryClientPage({ initialItems }: GalleryClientPageProps) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(
    editingItem?.image ? editingItem.image : null
  )

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', 'gallery')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      setImagePreview(data.path)
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const itemData: GalleryItem = {
      id: editingItem?.id || "",
      title: formData.get("title") as string,
      image: imagePreview || editingItem?.image || "",
      category: formData.get("category") as string,
      date: formData.get("date") as string || new Date().toISOString().split('T')[0],
    }

    if (!itemData.image) {
      toast.error("Please upload an image")
      setIsLoading(false)
      return
    }

    try {
      const result = await saveGalleryItem(itemData)
      if (result.success) {
        toast.success(editingItem ? "Image updated" : "Image added")
        setIsDialogOpen(false)
        setEditingItem(null)
        setImagePreview(null)
        // Reload to get the new data
        window.location.reload()
      } else {
        toast.error("Failed to save image")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return

    try {
      const result = await deleteGalleryItem(id)
      if (result.success) {
        toast.success("Image deleted")
        setItems(items.filter(i => i.id !== id))
      } else {
        toast.error("Failed to delete image")
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  const openEditDialog = (item: GalleryItem) => {
    setEditingItem(item)
    setImagePreview(item.image)
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingItem(null)
    setImagePreview(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
          <p className="text-muted-foreground">Manage your event photos and memories.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) closeDialog()
          setIsDialogOpen(open)
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingItem(null)
              setImagePreview(null)
            }} className="gap-2">
              <Plus className="h-4 w-4" /> Add Image
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Image" : "Add New Image"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title/Description</Label>
                <Input id="title" name="title" defaultValue={editingItem?.title} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category (Event Name)</Label>
                <Input id="category" name="category" defaultValue={editingItem?.category} placeholder="e.g. World Peace Awakening" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" defaultValue={editingItem?.date} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Upload Image</Label>
                <div className="flex flex-col gap-2">
                  <Input 
                    id="image" 
                    name="image" 
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="cursor-pointer"
                  />
                  {uploading && (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                    </div>
                  )}
                  {imagePreview && (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-slate-200">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || !imagePreview}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingItem ? "Update" : "Add Image")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="group relative aspect-video bg-slate-100 rounded-lg overflow-hidden border shadow-sm">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                <ImageIcon className="h-10 w-10" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => openEditDialog(item)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
              <p className="font-medium truncate">{item.title}</p>
              <p className="text-xs text-white/80">{item.category} • {item.date}</p>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
            <ImageIcon className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p>No images yet. Click "Add Image" to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}
