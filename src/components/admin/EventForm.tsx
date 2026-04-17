'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { saveEvent } from '@/lib/actions'
import { Loader2 } from 'lucide-react'
import { Event, Artist, Sponsor } from '@/lib/types'
import Image from 'next/image'
import { toast } from 'sonner'

export default function EventForm({ initialData }: { initialData?: Event }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image ? initialData.image : null
  )
  const [formData, setFormData] = useState<Event>(initialData || {
    title: '',
    slug: '',
    date: '',
    time: '',
    location: '',
    address: '',
    price: '',
    description: '',
    image: '',
    highlights: [],
    artists: [],
    sponsors: [],
    partners: []
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'number') {
      setFormData((prev: Event) => ({ ...prev, [name]: value === '' ? 0 : parseFloat(value) }))
    } else {
      setFormData((prev: Event) => ({ ...prev, [name]: value }))
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('file', file)
      formDataToSend.append('category', 'events')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataToSend
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setFormData((prev: Event) => ({ ...prev, image: data.path }))
      setImagePreview(data.path)
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleHighlightsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Split by newlines for simple array management
    const highlights = e.target.value.split('\n').filter(line => line.trim() !== '')
    setFormData((prev: Event) => ({ ...prev, highlights }))
  }

  const addArtist = () => {
    setFormData((prev: Event) => ({ ...prev, artists: [...(prev.artists || []), { name: '', image: '', stage: '' }] }))
  }

  const removeArtist = (index: number) => {
    setFormData((prev: Event) => ({ ...prev, artists: prev.artists?.filter((_, i) => i !== index) || [] }))
  }

  const handleArtistChange = (index: number, field: keyof Artist, value: string) => {
    setFormData((prev: Event) => {
      const newArtists = [...(prev.artists || [])]
      newArtists[index] = { ...newArtists[index], [field]: value }
      return { ...prev, artists: newArtists }
    })
  }

  const handleArtistImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('file', file)
      formDataToSend.append('category', 'events')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataToSend
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      setFormData((prev: Event) => {
        const newArtists = [...(prev.artists || [])]
        newArtists[index] = { ...newArtists[index], image: data.path }
        return { ...prev, artists: newArtists }
      })
      toast.success('Artist image uploaded')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const addSponsor = () => {
    setFormData((prev: Event) => ({ ...prev, sponsors: [...(prev.sponsors || []), { name: '', image: '' }] }))
  }

  const removeSponsor = (index: number) => {
    setFormData((prev: Event) => ({ ...prev, sponsors: prev.sponsors?.filter((_, i) => i !== index) || [] }))
  }

  const handleSponsorChange = (index: number, field: keyof Sponsor, value: string) => {
    setFormData((prev: Event) => {
      const newSponsors = [...(prev.sponsors || [])]
      newSponsors[index] = { ...newSponsors[index], [field]: value }
      return { ...prev, sponsors: newSponsors }
    })
  }

  const handleSponsorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('file', file)
      formDataToSend.append('category', 'events')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataToSend
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      setFormData((prev: Event) => {
        const newSponsors = [...(prev.sponsors || [])]
        newSponsors[index] = { ...newSponsors[index], image: data.path }
        return { ...prev, sponsors: newSponsors }
      })
      toast.success('Sponsor image uploaded')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const addPartner = () => {
    setFormData((prev: Event) => ({ ...prev, partners: [...(prev.partners || []), { name: '', image: '' }] }))
  }

  const removePartner = (index: number) => {
    setFormData((prev: Event) => ({ ...prev, partners: prev.partners?.filter((_, i) => i !== index) || [] }))
  }

  const handlePartnerChange = (index: number, field: keyof Sponsor, value: string) => {
    setFormData((prev: Event) => {
      const newPartners = [...(prev.partners || [])]
      newPartners[index] = { ...newPartners[index], [field]: value }
      return { ...prev, partners: newPartners }
    })
  }

  const handlePartnerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('file', file)
      formDataToSend.append('category', 'events')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataToSend
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      setFormData((prev: Event) => {
        const newPartners = [...(prev.partners || [])]
        newPartners[index] = { ...newPartners[index], image: data.path }
        return { ...prev, partners: newPartners }
      })
      toast.success('Partner image uploaded')
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
      // Ensure slug is generated if missing
      const dataToSave = {
        ...formData,
        slug: formData.slug || formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
      }
      
      await saveEvent(dataToSave)
      router.push('/admin/events')
      router.refresh()
    } catch (error) {
      console.error('Failed to save event:', error)
      alert('Failed to save event. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Event Title</label>
          <Input 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            placeholder="e.g. World Peace Music Festival" 
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
              placeholder="world-peace-festival" 
            />
            <p className="text-xs text-slate-500 mt-1">Leave blank to generate from title</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <Input 
              name="date" 
              value={formData.date} 
              onChange={handleChange} 
              placeholder="e.g. June 7, 2025" 
              required 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
            <Input 
              name="time" 
              value={formData.time} 
              onChange={handleChange} 
              placeholder="e.g. 10:00 AM - 10:00 PM" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Display Price (Text)</label>
            <Input 
              name="price" 
              value={formData.price} 
              onChange={handleChange} 
              placeholder="e.g. Free Entry or $25" 
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Ticket Price (Numeric)</label>
          <Input 
            name="ticketPrice" 
            type="number"
            min="0"
            step="0.01"
            value={formData.ticketPrice || ''} 
            onChange={handleChange} 
            placeholder="e.g. 25.00 (Leave 0 for free)" 
          />
          <p className="text-xs text-slate-500 mt-1">Used for PayPal checkout. Set to 0 for free registration.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Location Name</label>
          <Input 
            name="location" 
            value={formData.location} 
            onChange={handleChange} 
            placeholder="e.g. Mocking Bird Theatre" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Address</label>
          <Input 
            name="address" 
            value={formData.address} 
            onChange={handleChange} 
            placeholder="e.g. 230 Franklin Rd, Franklin, TN" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <Textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            placeholder="Event details..." 
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Highlights (one per line)</label>
          <Textarea 
            name="highlights" 
            defaultValue={initialData ? initialData.highlights.join('\n') : ''}
            onChange={handleHighlightsChange} 
            placeholder="- Live Music&#10;- Food Vendors&#10;- Art" 
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Event Image</label>
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

        {/* Artists Section */}
        <div className="space-y-4 rounded-lg border border-slate-200 p-4">
          <h3 className="text-lg font-medium text-slate-800">Artists</h3>
          {formData.artists?.map((artist, index) => (
            <div key={index} className="space-y-3 p-3 bg-slate-50 rounded-md">
              <div>
                <label className="block text-sm font-medium mb-1">Artist Name</label>
                <Input
                  value={artist.name}
                  onChange={(e) => handleArtistChange(index, 'name', e.target.value)}
                  placeholder="Artist Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Artist Image</label>
                <div className="flex flex-col gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleArtistImageUpload(e, index)}
                    disabled={uploading}
                    className="cursor-pointer"
                  />
                  {artist.image && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-slate-200">
                      <Image
                        src={artist.image}
                        alt={artist.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stage / Section</label>
                <Input
                  value={artist.stage || ''}
                  onChange={(e) => handleArtistChange(index, 'stage', e.target.value)}
                  placeholder="e.g. BESE SAKA STAGE or AKOMA LOUNGE STAGE"
                />
              </div>
              <Button type="button" variant="destructive" size="sm" onClick={() => removeArtist(index)}>
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addArtist}>
            Add Artist
          </Button>
        </div>

        {/* Sponsors Section */}
        <div className="space-y-4 rounded-lg border border-slate-200 p-4">
          <h3 className="text-lg font-medium text-slate-800">Sponsors</h3>
          {formData.sponsors?.map((sponsor, index) => (
            <div key={index} className="space-y-3 p-3 bg-slate-50 rounded-md">
              <div>
                <label className="block text-sm font-medium mb-1">Sponsor Name</label>
                <Input
                  value={sponsor.name}
                  onChange={(e) => handleSponsorChange(index, 'name', e.target.value)}
                  placeholder="Sponsor Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sponsor Logo</label>
                <div className="flex flex-col gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleSponsorImageUpload(e, index)}
                    disabled={uploading}
                    className="cursor-pointer"
                  />
                  {sponsor.image && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-slate-200">
                      <Image
                        src={sponsor.image}
                        alt={sponsor.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
              <Button type="button" variant="destructive" size="sm" onClick={() => removeSponsor(index)}>
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addSponsor}>
            Add Sponsor
          </Button>
        </div>

        <div className="space-y-4 rounded-lg border border-slate-200 p-4">
          <h3 className="text-lg font-medium text-slate-800">Community Partners</h3>
          {formData.partners?.map((partner, index) => (
            <div key={index} className="space-y-3 p-3 bg-slate-50 rounded-md">
              <div>
                <label className="block text-sm font-medium mb-1">Partner Name</label>
                <Input
                  value={partner.name}
                  onChange={(e) => handlePartnerChange(index, 'name', e.target.value)}
                  placeholder="Partner Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Partner Logo</label>
                <div className="flex flex-col gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePartnerImageUpload(e, index)}
                    disabled={uploading}
                    className="cursor-pointer"
                  />
                  {partner.image && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-slate-200">
                      <Image
                        src={partner.image}
                        alt={partner.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
              <Button type="button" variant="destructive" size="sm" onClick={() => removePartner(index)}>
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addPartner}>
            Add Community Partner
          </Button>
        </div>
      </div>

      <div className="flex gap-4 pt-4 border-t border-slate-100">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Update Event' : 'Create Event'}
        </Button>
      </div>
    </form>
  )
}
