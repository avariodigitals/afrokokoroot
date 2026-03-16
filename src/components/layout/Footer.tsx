import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react"
import { getContactInfo } from "@/lib/api"
import { ThreadsIcon } from "@/components/icons"

export async function Footer() {
  const contactInfo = await getContactInfo()
  
  const socialLinks = [
    { Icon: Instagram, label: "Instagram", href: contactInfo.socials.instagram, color: "hover:bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]" },
    { Icon: Facebook, label: "Facebook", href: contactInfo.socials.facebook, color: "hover:bg-[#1877F2]" },
    { Icon: ThreadsIcon, label: "Threads", href: contactInfo.socials.threads, color: "hover:bg-black" },
  ].filter(link => link.href) as { Icon: React.ComponentType<{ className?: string }>; label: string; href: string; color: string }[]
  
  return (
    <footer className="w-full bg-[#064e3b] text-white py-12 md:py-16 lg:py-24 border-t border-white/10 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/pattern-grid.svg')] opacity-5" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-950/50 to-black/50" />
      
      {/* Top Gradient Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-[#E9A907] to-green-700" />
      
      <div className="container relative z-10 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-6">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative h-44 w-[480px] transition-transform duration-300 group-hover:scale-105">
              <Image
                src="https://ik.imagekit.io/360t0n1jd9/Afrokoko%20Foundation%20Assets/Afrokoko%20Foundation%20Logo%20HZR.png"
                alt="Afrokokoroot Foundation"
                fill
                className="object-contain object-left"
              />
            </div>
          </Link>
          <p className="text-lime-100 leading-relaxed max-w-xs font-medium">
            Empowering communities through music, creative arts, and cultural exchange. 
            Afrokokoroot Foundation is a 501(c)(3) nonprofit organization dedicated to nurturing creativity, preserving cultural heritage, and strengthening communities.
          </p>
          <div className="flex gap-4 pt-2">
            {socialLinks.map(({ Icon, label, href, color }) => (
              <Link key={label} href={href} target="_blank" rel="noopener noreferrer" className={`bg-white/10 p-2.5 rounded-full text-white/80 transition-all hover:scale-110 hover:text-white hover:shadow-lg hover:shadow-white/10 ${color}`}>
                <Icon className="h-5 w-5" />
                <span className="sr-only">{label}</span>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          <h3 className="text-lg font-bold tracking-wide text-white border-b border-[#E9A907]/30 pb-2 inline-block">Quick Links</h3>
          <ul className="space-y-3 text-lime-100">
            {[
              { href: "/about", label: "About Us" },
              { href: "/programs", label: "Our Programs" },
              { href: "/events", label: "Upcoming Events" },
              { href: "/blog", label: "Latest News" },
              { href: "/privacy", label: "Privacy Policy" },
              { href: "/terms", label: "Terms of Service" }
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-[#E9A907] transition-all flex items-center gap-2 group">
                  <span className="h-1.5 w-1.5 bg-[#E9A907] rounded-full group-hover:w-3 transition-all duration-300" /> 
                  <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold tracking-wide text-white border-b border-[#E9A907]/30 pb-2 inline-block">Get Involved</h3>
          <ul className="space-y-3 text-lime-100">
            {[
              { href: "/donate", label: "Donate" },
              { href: "/get-involved", label: "Volunteer" },
              { href: "/contact", label: "Contact Us" }
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-[#E9A907] transition-all flex items-center gap-2 group">
                  <span className="h-1.5 w-1.5 bg-[#E9A907] rounded-full group-hover:w-3 transition-all duration-300" /> 
                  <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold tracking-wide text-white border-b border-[#E9A907]/30 pb-2 inline-block">Contact Info</h3>
          <ul className="space-y-4 text-lime-100">
            <li className="flex items-start gap-3 group">
              <div className="p-2 rounded-full bg-white/5 group-hover:bg-[#E9A907]/20 transition-colors">
                <MapPin className="h-5 w-5 shrink-0 text-[#E9A907] group-hover:text-[#c28e06]" />
              </div>
              <span className="mt-1 whitespace-pre-line">{contactInfo.address}</span>
            </li>
            <li className="flex items-center gap-3 group">
              <div className="p-2 rounded-full bg-white/5 group-hover:bg-[#E9A907]/20 transition-colors">
                <Phone className="h-5 w-5 shrink-0 text-[#E9A907] group-hover:text-[#c28e06]" />
              </div>
              <span>{contactInfo.phone}</span>
            </li>
            <li className="flex items-center gap-3 group">
              <div className="p-2 rounded-full bg-white/5 group-hover:bg-[#E9A907]/20 transition-colors">
                <Mail className="h-5 w-5 shrink-0 text-[#E9A907] group-hover:text-[#c28e06]" />
              </div>
              <a href={`mailto:${contactInfo.email}`} className="hover:text-white transition-colors">{contactInfo.email}</a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container relative z-10 mt-16 pt-8 border-t border-white/10 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-sm text-lime-200/60 font-medium">
        <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-center">
          <p>&copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> Afrokokoroot Foundation. All rights reserved.</p>
        </div>
        <div className="flex gap-8 mt-4 md:mt-0">
          <p>
            Designed and developed by{" "}
            <a 
              href="https://www.avariodigitals.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-lime-200 hover:text-lime-400 transition-colors"
            >
              Avario Digitals
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
