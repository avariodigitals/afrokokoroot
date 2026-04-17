'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { saveTeamMember } from '@/lib/actions'
import { Loader2, Upload } from 'lucide-react'
import { TeamMember } from '@/lib/types'
import Image from 'next/image'
import { toast } from 'sonner'

interface TeamFormProps {
  initialData?: TeamMember
}

export default function TeamForm({ initialData }: TeamFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    slug: initialData?.slug || '',
    name: initialData?.name || '',
    role: initialData?.role || '',
    bio: initialData?.bio || '',
    image: initialData?.image || '',
  })
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image ? initialData.image : null
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('file', file)
      formDataToSend.append('category', 'team')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataToSend
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setFormData(prev => ({ ...prev, image: data.path }))
      setImagePreview(data.path)
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    // Only auto-generate slug if it's a new member
    if (!initialData) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, name, slug }))
    } else {
      setFormData(prev => ({ ...prev, name }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await saveTeamMember(formData)
      router.push('/admin/team')
      router.refresh()
    } catch (error) {
      console.error('Error saving team member:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">Full Name</label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleNameChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="slug" className="text-sm font-medium">Slug (URL)</label>
          <Input
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            disabled={!!initialData}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="role" className="text-sm font-medium">Role / Position</label>
        <Input
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="image" className="text-sm font-medium">Profile Image</label>
        <div className="flex flex-col gap-4">
          <div className="relative">
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
              <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
              </div>
            )}
          </div>
          {imagePreview && (
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-slate-200">
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

      <div className="space-y-2">
        <label htmlFor="bio" className="text-sm font-medium">Bio</label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={5}
          required
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Update Member' : 'Add Member'}
        </Button>
      </div>
    </form>
  )
}
