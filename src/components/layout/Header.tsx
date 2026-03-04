"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Programs", href: "/programs" },
  { name: "Events", href: "/events" },
  { name: "Get Involved", href: "/get-involved" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
]

const moreLinks = [
  { name: "Impact", href: "/impact" },
  { name: "Gallery", href: "/gallery" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const pathname = usePathname()
  const isHome = pathname === "/"

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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

  const isTransparent = isHome && !scrolled && !mobileMenuOpen

  return (
    <>
      <header className="fixed top-0 z-50 w-full transition-all duration-300">
        {/* Header Background */}
        <div className={cn(
          "absolute inset-0 transition-all duration-300",
          isTransparent 
            ? "bg-transparent" 
            : "bg-white/95 backdrop-blur-sm border-b border-lime-200 shadow-sm"
        )} />
        <div className={cn(
          "absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent z-10 transition-opacity duration-300",
          isTransparent ? "opacity-0" : "opacity-50"
        )} />
        
        <div className="container flex h-20 items-center justify-between relative z-20">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2 group relative z-50" onClick={() => setMobileMenuOpen(false)}>
              <div className="absolute -inset-2 bg-gradient-to-r from-green-500/20 to-lime-500/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-16 w-64 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="Afrokokoroot Foundation"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-bold transition-colors rounded-full group overflow-hidden",
                  isTransparent
                    ? (pathname === item.href 
                        ? "text-[#E9A907] bg-white/10 backdrop-blur-sm" 
                        : "text-white/90 hover:text-white hover:bg-white/10")
                    : (pathname === item.href 
                        ? "text-green-700 bg-lime-100" 
                        : "text-slate-600 hover:text-green-700 hover:bg-lime-50/80")
                )}
              >
                <span className="relative z-10">{item.name}</span>
                {pathname === item.href && (
                  <span className={cn(
                    "absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r",
                    isTransparent ? "from-[#E9A907] to-yellow-300" : "from-green-500 to-lime-500"
                  )} />
                )}
              </Link>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger className={cn(
                "flex items-center gap-1 px-4 py-2 text-sm font-bold transition-colors rounded-full group outline-none",
                isTransparent 
                  ? "text-white/90 hover:text-white hover:bg-white/10" 
                  : "text-slate-600 hover:text-green-700 hover:bg-lime-50/80"
              )}>
                More <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white/95 backdrop-blur-md border-lime-200">
                {moreLinks.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link 
                      href={item.href}
                      className={cn(
                        "w-full cursor-pointer font-medium",
                        pathname === item.href ? "text-green-700 bg-lime-50" : "text-slate-700 hover:text-green-700 hover:bg-lime-50"
                      )}
                    >
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button asChild size="lg" className="ml-4 shadow-lg shadow-green-500/20 bg-[#E9A907] text-[#1a2e05] hover:bg-[#c28e06] border-0 rounded-full font-bold transition-all hover:scale-105">
              <Link href="/donate">Donate</Link>
            </Button>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden relative z-50">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className={cn(
                "relative transition-colors",
                isTransparent 
                  ? "text-white hover:bg-white/20" 
                  : "text-green-900 hover:bg-lime-100 hover:text-green-700"
              )}
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
          "fixed top-20 left-0 right-0 bottom-0 z-40 bg-lime-50 lg:hidden transition-all duration-300 ease-in-out transform border-t border-lime-200 shadow-inner",
          mobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        )}
      >
        <div className="container h-full flex flex-col items-center pt-8 pb-10 overflow-y-auto">
          <div className="flex flex-col items-center space-y-2 w-full max-w-md">
            {navigation.map((item, i) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-xl font-bold transition-all py-4 px-6 rounded-2xl block w-full text-center hover:bg-white/60 active:scale-95",
                  pathname === item.href
                    ? "text-green-800 bg-white shadow-sm border border-lime-100"
                    : "text-green-900/80 hover:text-green-900"
                )}
                style={{ 
                  transitionDelay: `${i * 50}ms`,
                  opacity: mobileMenuOpen ? 1 : 0,
                  transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(10px)',
                  transitionProperty: 'opacity, transform'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <div className="w-full h-px bg-lime-200/50 my-4" />
            
            {moreLinks.map((item, i) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-lg font-semibold transition-all py-3 px-6 rounded-2xl block w-full text-center hover:bg-white/60 active:scale-95",
                  pathname === item.href
                    ? "text-green-800 bg-white shadow-sm border border-lime-100"
                    : "text-green-800/70 hover:text-green-900"
                )}
                style={{ 
                  transitionDelay: `${(navigation.length + i) * 50}ms`,
                  opacity: mobileMenuOpen ? 1 : 0,
                  transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(10px)',
                  transitionProperty: 'opacity, transform'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          <div className="w-full max-w-xs mt-auto pt-8 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-forwards">
            <Button asChild className="w-full h-14 text-xl font-bold bg-[#E9A907] text-[#1a2e05] hover:bg-[#c28e06] shadow-xl rounded-full hover:scale-105 transition-transform">
              <Link href="/donate" onClick={() => setMobileMenuOpen(false)}>
                Donate Now
              </Link>
            </Button>
            
            <p className="mt-8 text-center text-green-700/60 text-sm font-medium">
              &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> Afrokokoroot Foundation
            </p>
          </div>
        </div>
      </div>
    </header>
    {!isHome && <div className="h-20" />}
    </>
  )
}
