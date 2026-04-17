'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Calendar, FileText, Settings, LogOut, Music, Users, BarChart3, Globe, Menu, X, Image as ImageIcon, Shield } from 'lucide-react'
import { hasAdminPermission } from '@/lib/admin-permissions'
import { AdminUserProfile } from '@/lib/types'

interface AdminShellProps {
  children: React.ReactNode
  currentUser: AdminUserProfile | null
}

export default function AdminShell({ children, currentUser }: AdminShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setIsSidebarOpen(false), 0)
    return () => clearTimeout(timeout)
  }, [pathname])

  const navItems = useMemo(() => {
    if (!currentUser) {
      return []
    }

    const items = [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, permission: 'dashboard' as const },
      { href: '/admin/events', label: 'Events', icon: Calendar, permission: 'events' as const },
      { href: '/admin/blog', label: 'Blog Posts', icon: FileText, permission: 'blog' as const },
      { href: '/admin/pages', label: 'Pages', icon: Globe, permission: 'pages' as const },
      { href: '/admin/programs', label: 'Programs', icon: Music, permission: 'programs' as const },
      { href: '/admin/team', label: 'Team', icon: Users, permission: 'team' as const },
      { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon, permission: 'gallery' as const },
      { href: '/admin/impact', label: 'Impact Metrics', icon: BarChart3, permission: 'impact' as const },
      { href: '/admin/leads', label: 'Leads', icon: Users, permission: 'leads' as const },
      { href: '/admin/settings', label: 'Settings', icon: Settings, permission: 'settings' as const },
      { href: '/admin/users', label: 'Users & Access', icon: Shield, permission: 'users' as const },
    ]

    return items.filter((item) => hasAdminPermission(currentUser, item.permission))
  }, [currentUser])

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  return (
    <div className="flex h-screen bg-lime-50 font-sans">
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-green-900 flex items-center justify-between px-4 z-40 shadow-md">
        <h1 className="text-lg font-bold tracking-tight text-white">Afrokokoroot <span className="text-lime-400">Admin</span></h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-lime-100 hover:bg-white/10 rounded-lg"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-green-900 text-white flex flex-col shrink-0 transform transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-auto lg:flex
      `}>
        <div className="flex items-center justify-between p-6 border-b border-white/10 h-16 lg:h-auto">
          <div>
            <h1 className="text-xl font-bold tracking-tight hidden lg:block">Afrokokoroot <span className="text-lime-400">Admin</span></h1>
            {currentUser ? (
              <p className="hidden lg:block text-xs text-lime-200 mt-2">Signed in as {currentUser.name}</p>
            ) : null}
          </div>
          <h1 className="text-xl font-bold tracking-tight lg:hidden">Menu</h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 text-lime-300 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.href === '/admin'
              ? pathname === item.href
              : pathname?.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-white/10 text-white' : 'text-lime-100 hover:bg-white/5'}`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3 text-lime-300 hover:bg-white/10 rounded-lg transition-colors">
            <Globe className="h-5 w-5" />
            <span>Open Website</span>
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

      <main className="flex-1 overflow-y-auto bg-lime-50 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
