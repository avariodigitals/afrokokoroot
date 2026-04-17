import Link from "next/link"
import { getEvents } from "@/lib/api"
import { Plus, Pencil, Trash2, Calendar } from "lucide-react"
import { deleteEvent } from "@/lib/actions"
import { Event } from "@/lib/types"
import { requireAdminPagePermission } from "@/lib/admin-auth"

export default async function AdminEventsPage() {
  await requireAdminPagePermission('events')
  const events = await getEvents()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Events</h1>
          <p className="text-slate-500 mt-1">Manage your upcoming and past events</p>
        </div>
        <Link 
          href="/admin/events/new" 
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium w-full sm:w-auto justify-center"
        >
          <Plus className="h-4 w-4" />
          Add Event
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Event Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Date & Time</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Location</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
          <tbody className="divide-y divide-slate-100">
            {events.map((event: Event) => (
              <tr key={event.slug} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{event.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{event.slug}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>{event.date}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 ml-6">{event.time}</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {event.location}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link 
                      href={`/admin/events/${event.slug}`}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit Event"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <form action={async () => {
                      'use server'
                      await deleteEvent(event.slug)
                    }}>
                      <button 
                        type="submit"
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Event"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  No events found. Click &quot;Add Event&quot; to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  )
}
