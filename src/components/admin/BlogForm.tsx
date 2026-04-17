'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { saveBlogPost } from '@/lib/actions'
import { Loader2 } from 'lucide-react'
import { BlogPost } from '@/lib/types'
import Image from 'next/image'
import { toast } from 'sonner'

export default function BlogForm({ initialData }: { initialData?: BlogPost }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image ? initialData.image : null
  )
  const [formData, setFormData] = useState<BlogPost>(initialData || {
    title: '',
    slug: '',
    date: '',
    author: '',
    category: '',
    excerpt: '',
    image: '',
    content: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('file', file)
      formDataToSend.append('category', 'blog')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataToSend
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setFormData((prev: any) => ({ ...prev, image: data.path }))
      setImagePreview(data.path)
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const dataToSave = {
        ...formData,
        slug: formData.slug || formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
      }
      
        await saveBlogPost(dataToSave, initialData?.slug)
      router.push('/admin/blog')
      router.refresh()
    } catch (error) {
      console.error('Failed to save post:', error)
      alert('Failed to save post. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Post Title</label>
          <Input 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            placeholder="e.g. The Healing Power of Rhythm" 
            required 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL)</label>
            <Input 
              name="slug" 
              value={formData.slug} 
              onChange={handleChange} 
              placeholder="healing-power-of-rhythm" 
            />
            <p className="text-xs text-slate-500 mt-1">Leave blank to generate from title</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <Input 
              name="date" 
              value={formData.date} 
              onChange={handleChange} 
              placeholder="e.g. February 15, 2026" 
              required 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
            <Input 
              name="author" 
              value={formData.author} 
              onChange={handleChange} 
              placeholder="e.g. Sunny Dada" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <Input 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              placeholder="e.g. Wellness" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Excerpt</label>
          <Textarea 
            name="excerpt" 
            value={formData.excerpt} 
            onChange={handleChange} 
            placeholder="Brief summary..." 
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Content (Markdown supported)</label>
          <Textarea 
            name="content" 
            value={formData.content} 
            onChange={handleChange} 
            placeholder="Write your post here..." 
            rows={10}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Image</label>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Input
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="cursor-pointer"
              />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                </div>
              )}
            </div>
            {imagePreview && (
              <div className="relative w-48 h-32 rounded-lg overflow-hidden border-2 border-slate-200">
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
      </div>

      <div className="flex gap-4 pt-4 border-t border-slate-100">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Update Post' : 'Create Post'}
        </Button>
      </div>
    </form>
  )
}
