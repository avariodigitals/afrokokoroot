import EventForm from '@/components/admin/EventForm'
import { requireAdminPagePermission } from '@/lib/admin-auth'

export default async function NewEventPage() {
  await requireAdminPagePermission('events')

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Create New Event</h1>
        <p className="text-slate-500 mt-2">Fill out the details below to publish a new event.</p>
      </div>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <EventForm />
      </div>
    </div>
  )
}
