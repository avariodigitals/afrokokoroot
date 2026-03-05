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
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const itemData: GalleryItem = {
      id: editingItem?.id || "",
      title: formData.get("title") as string,
      image: formData.get("image") as string,
      category: formData.get("category") as string,
      date: formData.get("date") as string || new Date().toISOString().split('T')[0],
    }

    try {
      const result = await saveGalleryItem(itemData)
      if (result.success) {
        toast.success(editingItem ? "Image updated" : "Image added")
        setIsDialogOpen(false)
        setEditingItem(null)
        // Optimistic update - in real app would rely on revalidation or returned data
        if (editingItem) {
          setItems(items.map(i => i.id === editingItem.id ? itemData : i))
        } else {
          // Since we don't get the ID back immediately without reloading or returning it, 
          // we might need to refresh. For now, let's just reload or trust revalidation if we were using server components fully.
          // Let's just reload for simplicity to get the new ID.
          window.location.reload()
        }
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
          <p className="text-muted-foreground">Manage your event photos and memories.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem(null)} className="gap-2">
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
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" name="image" defaultValue={editingItem?.image} placeholder="https://..." required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
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
                onClick={() => {
                  setEditingItem(item)
                  setIsDialogOpen(true)
                }}
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
