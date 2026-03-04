'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { saveEvent } from '@/lib/actions'
import { Loader2 } from 'lucide-react'
import { Event } from '@/lib/types'

export default function EventForm({ initialData }: { initialData?: Event }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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
    highlights: []
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'number') {
      setFormData((prev: Event) => ({ ...prev, [name]: value === '' ? 0 : parseFloat(value) }))
    } else {
      setFormData((prev: Event) => ({ ...prev, [name]: value }))
    }
  }

  const handleHighlightsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Split by newlines for simple array management
    const highlights = e.target.value.split('\n').filter(line => line.trim() !== '')
    setFormData((prev: Event) => ({ ...prev, highlights }))
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
          <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
          <Input 
            name="image" 
            value={formData.image} 
            onChange={handleChange} 
            placeholder="/images/event.jpg" 
          />
          <p className="text-xs text-slate-500 mt-1">Enter a path to an image in the public folder (e.g., /event.jpg)</p>
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
