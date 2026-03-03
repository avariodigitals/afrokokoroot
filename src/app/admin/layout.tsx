"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Calendar, FileText, Settings, LogOut, Music, Users, BarChart3, Globe, Menu, X } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Close sidebar on route change
  useEffect(() => {
    const timeout = setTimeout(() => setIsSidebarOpen(false), 0)
    return () => clearTimeout(timeout)
  }, [pathname])

  // If on login page, render without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/admin/login")
      router.refresh()
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  return (
    <div className="flex h-screen bg-lime-50 font-sans">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-green-900 flex items-center justify-between px-4 z-40 shadow-md">
        <h1 className="text-lg font-bold tracking-tight text-white">Afrokokoroot <span className="text-lime-400">Admin</span></h1>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-lime-100 hover:bg-white/10 rounded-lg"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-green-900 text-white flex flex-col shrink-0 transform transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-auto lg:flex
      `}>
        <div className="flex items-center justify-between p-6 border-b border-white/10 h-16 lg:h-auto">
          <h1 className="text-xl font-bold tracking-tight hidden lg:block">Afrokokoroot <span className="text-lime-400">Admin</span></h1>
          <h1 className="text-xl font-bold tracking-tight lg:hidden">Menu</h1>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 text-lime-300 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === '/admin' ? 'bg-white/10 text-white' : 'text-lime-100 hover:bg-white/5'}`}>
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/events" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname?.startsWith('/admin/events') ? 'bg-white/10 text-white' : 'text-lime-100 hover:bg-white/5'}`}>
            <Calendar className="h-5 w-5" />
            <span>Events</span>
          </Link>
          <Link href="/admin/blog" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname?.startsWith('/admin/blog') ? 'bg-white/10 text-white' : 'text-lime-100 hover:bg-white/5'}`}>
            <FileText className="h-5 w-5" />
            <span>Blog Posts</span>
          </Link>
          <Link href="/admin/programs" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname?.startsWith('/admin/programs') ? 'bg-white/10 text-white' : 'text-lime-100 hover:bg-white/5'}`}>
            <Music className="h-5 w-5" />
            <span>Programs</span>
          </Link>
          <Link href="/admin/team" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname?.startsWith('/admin/team') ? 'bg-white/10 text-white' : 'text-lime-100 hover:bg-white/5'}`}>
            <Users className="h-5 w-5" />
            <span>Team</span>
          </Link>
          <Link href="/admin/impact" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname?.startsWith('/admin/impact') ? 'bg-white/10 text-white' : 'text-lime-100 hover:bg-white/5'}`}>
            <BarChart3 className="h-5 w-5" />
            <span>Impact Metrics</span>
          </Link>
          <Link href="/admin/settings" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname?.startsWith('/admin/settings') ? 'bg-white/10 text-white' : 'text-lime-100 hover:bg-white/5'}`}>
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-lime-300 hover:bg-white/10 rounded-lg transition-colors">
            <Globe className="h-5 w-5" />
            <span>View Site</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-500/10 hover:text-red-200 rounded-lg transition-colors text-left"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-lime-50 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
