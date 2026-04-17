'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { saveProgram } from '@/lib/actions'
import { Loader2 } from 'lucide-react'
import { Program } from '@/lib/types'
import Image from 'next/image'
import { toast } from 'sonner'

interface ProgramFormProps {
  initialData?: Program
}

const DEFAULT_OFFER_ITEMS = [
  'Professional Instruction',
  'Cultural Immersion',
  'Performance Opportunities',
  'Community Building',
  'Skill Development',
  'Mentorship',
]

export default function ProgramForm({ initialData }: ProgramFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image ? initialData.image : null
  )
  const [formData, setFormData] = useState({
    slug: initialData?.slug || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    content: initialData?.content || '',
    image: initialData?.image || '',
    overviewSecondary: initialData?.overviewSecondary || '',
    offerItems: initialData?.offerItems?.join('\n') || DEFAULT_OFFER_ITEMS.join('\n'),
    getInvolvedTitle: initialData?.getInvolvedTitle || 'Get Involved',
    getInvolvedText: initialData?.getInvolvedText || 'Ready to join the experience? Sign up for upcoming workshops, bring a session to your school or organization, or connect with us to learn more.',
    getInvolvedPrimaryLabel: initialData?.getInvolvedPrimaryLabel || 'Register Now',
    getInvolvedPrimaryHref: initialData?.getInvolvedPrimaryHref || '/contact',
    getInvolvedSecondaryLabel: initialData?.getInvolvedSecondaryLabel || 'Request Information',
    getInvolvedSecondaryHref: initialData?.getInvolvedSecondaryHref || '/contact',
    supportTitle: initialData?.supportTitle || 'Support This Program',
    supportText: initialData?.supportText || 'Your donation helps provide scholarships and instruments for students in need.',
    supportButtonLabel: initialData?.supportButtonLabel || `Donate to ${initialData?.title || 'This Program'}`,
    supportButtonHref: initialData?.supportButtonHref || '/donate',
  })

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
      formDataToSend.append('category', 'programs')

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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    // Only auto-generate slug if it's a new program
    if (!initialData) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, title, slug }))
    } else {
      setFormData(prev => ({ ...prev, title }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await saveProgram({
        ...formData,
        offerItems: formData.offerItems
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
      })
      router.push('/admin/programs')
      router.refresh()
    } catch (error) {
      console.error('Error saving program:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">Program Title</label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleTitleChange}
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
            disabled={!!initialData} // Disable slug editing for existing programs to prevent breaking links
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="image" className="text-sm font-medium">Program Image</label>
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

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Short Description</label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="text-sm font-medium">Full Content</label>
        <Textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={8}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="overviewSecondary" className="text-sm font-medium">Secondary Overview Paragraph</label>
        <Textarea
          id="overviewSecondary"
          name="overviewSecondary"
          value={formData.overviewSecondary}
          onChange={handleChange}
          rows={4}
          placeholder="Optional second paragraph for the program overview section"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="offerItems" className="text-sm font-medium">What We Offer Items</label>
        <Textarea
          id="offerItems"
          name="offerItems"
          value={formData.offerItems}
          onChange={handleChange}
          rows={6}
          placeholder="One item per line"
        />
        <p className="text-xs text-slate-500">Enter one offering per line.</p>
      </div>

      <div className="rounded-xl border border-slate-200 p-5 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Get Involved Card</h2>
          <p className="text-sm text-slate-500">Control the first sidebar card for this program.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="getInvolvedTitle" className="text-sm font-medium">Card Title</label>
          <Input
            id="getInvolvedTitle"
            name="getInvolvedTitle"
            value={formData.getInvolvedTitle}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="getInvolvedText" className="text-sm font-medium">Card Text</label>
          <Textarea
            id="getInvolvedText"
            name="getInvolvedText"
            value={formData.getInvolvedText}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="getInvolvedPrimaryLabel" className="text-sm font-medium">Primary Button Label</label>
            <Input
              id="getInvolvedPrimaryLabel"
              name="getInvolvedPrimaryLabel"
              value={formData.getInvolvedPrimaryLabel}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="getInvolvedPrimaryHref" className="text-sm font-medium">Primary Button Link</label>
            <Input
              id="getInvolvedPrimaryHref"
              name="getInvolvedPrimaryHref"
              value={formData.getInvolvedPrimaryHref}
              onChange={handleChange}
              placeholder="/contact"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="getInvolvedSecondaryLabel" className="text-sm font-medium">Secondary Button Label</label>
            <Input
              id="getInvolvedSecondaryLabel"
              name="getInvolvedSecondaryLabel"
              value={formData.getInvolvedSecondaryLabel}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="getInvolvedSecondaryHref" className="text-sm font-medium">Secondary Button Link</label>
            <Input
              id="getInvolvedSecondaryHref"
              name="getInvolvedSecondaryHref"
              value={formData.getInvolvedSecondaryHref}
              onChange={handleChange}
              placeholder="/contact"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 p-5 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Support Card</h2>
          <p className="text-sm text-slate-500">Control the donation card for this program.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="supportTitle" className="text-sm font-medium">Card Title</label>
          <Input
            id="supportTitle"
            name="supportTitle"
            value={formData.supportTitle}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="supportText" className="text-sm font-medium">Card Text</label>
          <Textarea
            id="supportText"
            name="supportText"
            value={formData.supportText}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="supportButtonLabel" className="text-sm font-medium">Button Label</label>
            <Input
              id="supportButtonLabel"
              name="supportButtonLabel"
              value={formData.supportButtonLabel}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="supportButtonHref" className="text-sm font-medium">Button Link</label>
            <Input
              id="supportButtonHref"
              name="supportButtonHref"
              value={formData.supportButtonHref}
              onChange={handleChange}
              placeholder="/donate"
            />
          </div>
        </div>
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
          {initialData ? 'Update Program' : 'Create Program'}
        </Button>
      </div>
    </form>
  )
}
