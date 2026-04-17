import { notFound } from 'next/navigation'
import EventForm from '@/components/admin/EventForm'
import { getEvents } from '@/lib/api'
import { Event } from '@/lib/types'
import { requireAdminPagePermission } from '@/lib/admin-auth'

export async function generateStaticParams() {
  const events = await getEvents()
  return events.map((event: Event) => ({
    slug: event.slug,
  }))
}

export default async function EditEventPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdminPagePermission('events')
  const { slug } = await params
  const events = await getEvents()
  const event = events.find((e: Event) => e.slug === slug)

  if (!event) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Edit Event</h1>
        <p className="text-slate-500 mt-2">Update the details for &quot;{event.title}&quot;.</p>
      </div>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <EventForm initialData={event} />
      </div>
    </div>
  )
}
