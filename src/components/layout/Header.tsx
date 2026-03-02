"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "About", href: "/about" },
  { name: "Programs", href: "/programs" },
  { name: "Impact", href: "/impact" },
  { name: "Events", href: "/events" },
  { name: "Gallery", href: "/gallery" },
  { name: "Get Involved", href: "/get-involved" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const pathname = usePathname()

  // Prevent body scroll when menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [mobileMenuOpen])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-orange-100 bg-white shadow-sm">
      <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-50" />
      
      <div className="container flex h-20 items-center justify-between relative">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2 group relative z-50" onClick={() => setMobileMenuOpen(false)}>
            <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 group-hover:scale-105 transition-transform duration-300">
              Afrokokoroot
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative px-4 py-2 text-sm font-bold transition-colors hover:text-orange-600 rounded-full hover:bg-orange-50/50 group overflow-hidden",
                pathname === item.href
                  ? "text-orange-600 bg-orange-50"
                  : "text-slate-600"
              )}
            >
              <span className="relative z-10">{item.name}</span>
              {pathname === item.href && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-orange-400 to-purple-500" />
              )}
            </Link>
          ))}
          <Button asChild size="lg" className="ml-4 shadow-lg shadow-orange-500/20 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 border-0 rounded-full font-bold transition-all hover:scale-105">
            <Link href="/donate">Donate</Link>
          </Button>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="flex lg:hidden z-50">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="text-slate-900 hover:bg-orange-50 hover:text-orange-600 relative"
          >
            {mobileMenuOpen ? (
               <X className="h-6 w-6" />
            ) : (
               <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-white lg:hidden transition-all duration-300 ease-in-out transform",
          mobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        )}
      >
        <div className="container h-full flex flex-col justify-center items-center space-y-8 pt-20 pb-10 overflow-y-auto">
          <div className="flex flex-col items-center space-y-6 w-full max-w-md">
            {navigation.map((item, i) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-2xl font-black transition-all hover:text-orange-600 hover:scale-105 py-2 px-4 rounded-xl block w-full text-center",
                  pathname === item.href
                    ? "text-orange-600 bg-orange-50"
                    : "text-slate-800"
                )}
                style={{ 
                  transitionDelay: `${i * 50}ms`,
                  opacity: mobileMenuOpen ? 1 : 0,
                  transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                  transitionProperty: 'opacity, transform'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          <div className="w-full max-w-xs pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-forwards">
            <Button asChild className="w-full h-14 text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 shadow-xl rounded-full hover:scale-105 transition-transform">
              <Link href="/donate" onClick={() => setMobileMenuOpen(false)}>
                Donate Now
              </Link>
            </Button>
            
            <p className="mt-8 text-center text-slate-400 text-sm">
              &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> Afrokokoroot Foundation
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
