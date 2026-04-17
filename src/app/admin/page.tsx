import Link from "next/link"
import { Calendar, FileText, Users, Globe, Image as ImageIcon, BarChart3 } from "lucide-react"
import { getEvents, getBlogPosts, getPrograms, getTeam, getPages, getStorageStatus, getLeads, getGalleryItems, getImpactMetrics } from "@/lib/api"
import { Event, BlogPost } from "@/lib/types"
import AdminStorageNotice from "@/components/admin/AdminStorageNotice"
import { getCurrentAdminUser, requireAdminPagePermission } from "@/lib/admin-auth"
import { hasAdminPermission } from "@/lib/admin-permissions"

export default async function AdminDashboard() {
  await requireAdminPagePermission('dashboard')

  const currentUser = await getCurrentAdminUser()
  const events = await getEvents()
  const blogs = await getBlogPosts()
  const programs = await getPrograms()
  const team = await getTeam()
  const pages = await getPages()
  const leads = await getLeads()
  const gallery = await getGalleryItems()
  const impactMetrics = await getImpactMetrics()
  const storageStatus = getStorageStatus()

  const stats = [
    {
      label: "Upcoming Events",
      value: events.length,
      icon: Calendar,
      color: "bg-green-500",
      href: "/admin/events",
      permission: 'events' as const,
    },
    {
      label: "Blog Posts",
      value: blogs.length,
      icon: FileText,
      color: "bg-lime-500",
      href: "/admin/blog",
      permission: 'blog' as const,
    },
    {
      label: "Programs",
      value: programs.length,
      icon: Users,
      color: "bg-emerald-500",
      href: "/admin/programs",
      permission: 'programs' as const,
    },
    {
      label: "Page Content",
      value: pages.length,
      icon: Globe,
      color: "bg-indigo-500",
      href: "/admin/pages",
      permission: 'pages' as const,
    },
    {
      label: "Team Members",
      value: team.length,
      icon: Users,
      color: "bg-teal-500",
      href: "/admin/team",
      permission: 'team' as const,
    },
    {
      label: "Leads",
      value: leads.length,
      icon: Users,
      color: "bg-cyan-500",
      href: "/admin/leads",
      permission: 'leads' as const,
    },
    {
      label: "Gallery Items",
      value: gallery.length,
      icon: ImageIcon,
      color: "bg-amber-500",
      href: "/admin/gallery",
      permission: 'gallery' as const,
    },
    {
      label: "Impact Metrics",
      value: impactMetrics.length,
      icon: BarChart3,
      color: "bg-rose-500",
      href: "/admin/impact",
      permission: 'impact' as const,
    },
  ].filter((stat) => currentUser && hasAdminPermission(currentUser, stat.permission))

  const canViewEvents = currentUser ? hasAdminPermission(currentUser, 'events') : false
  const canViewBlog = currentUser ? hasAdminPermission(currentUser, 'blog') : false

  return (
    <div className="space-y-8">
      <AdminStorageNotice status={storageStatus} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-900">Dashboard Overview</h1>
        <div className="flex items-center gap-2 text-sm text-green-700">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link 
            key={stat.label} 
            href={stat.href}
            className="block p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-lime-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <span className="text-2xl font-bold text-green-900">{stat.value}</span>
            </div>
            <h3 className="text-sm font-medium text-green-600">{stat.label}</h3>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {canViewEvents ? (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-lime-100">
            <h2 className="text-lg font-semibold text-green-900 mb-4">Recent Events</h2>
            <div className="space-y-4">
              {events.slice(0, 3).map((event: Event) => (
                <div key={event.slug} className="flex items-center justify-between p-4 bg-lime-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-green-900">{event.title}</h4>
                    <p className="text-sm text-green-600">{event.date}</p>
                  </div>
                  <Link href={`/admin/events/${event.slug}`} className="text-sm font-medium text-green-600 hover:text-green-800">
                    Edit
                  </Link>
                </div>
              ))}
              {events.length === 0 && <p className="text-green-500 text-sm">No events found.</p>}
            </div>
            <div className="mt-4 pt-4 border-t border-lime-100">
              <Link href="/admin/events" className="text-sm font-medium text-green-600 hover:text-green-800">
                View all events &rarr;
              </Link>
            </div>
          </div>
        ) : null}

        {canViewBlog ? (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-lime-100">
            <h2 className="text-lg font-semibold text-green-900 mb-4">Latest Blog Posts</h2>
            <div className="space-y-4">
              {blogs.slice(0, 3).map((blog: BlogPost) => (
                <div key={blog.slug} className="flex items-center justify-between p-4 bg-lime-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-green-900">{blog.title}</h4>
                    <p className="text-sm text-green-600">{blog.date} • {blog.author}</p>
                  </div>
                  <Link href={`/admin/blog/${blog.slug}`} className="text-sm font-medium text-green-600 hover:text-green-800">
                    Edit
                  </Link>
                </div>
              ))}
              {blogs.length === 0 && <p className="text-green-500 text-sm">No blog posts found.</p>}
            </div>
            <div className="mt-4 pt-4 border-t border-lime-100">
              <Link href="/admin/blog" className="text-sm font-medium text-green-600 hover:text-green-800">
                View all posts &rarr;
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
