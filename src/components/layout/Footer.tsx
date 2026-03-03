import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react"
import { getContactInfo } from "@/lib/api"

export async function Footer() {
  const contactInfo = await getContactInfo()
  
  return (
    <footer className="w-full bg-[#064e3b] text-white py-12 md:py-16 lg:py-24 border-t border-white/10 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/pattern-grid.svg')] opacity-5" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-950/50 to-black/50" />
      
      {/* Top Gradient Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-lime-500 to-green-700" />
      
      <div className="container relative z-10 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-6">
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-lime-200 group-hover:to-white transition-all">
              Afrokokoroot <span className="text-lime-400">Foundation</span>
            </span>
          </Link>
          <p className="text-lime-100 leading-relaxed max-w-xs font-medium">
            Empowering communities through music, art, and cultural exchange. 
            A 501(c)(3) nonprofit organization dedicated to preserving and celebrating African heritage.
          </p>
          <div className="flex gap-4 pt-2">
            {[
              { Icon: Facebook, label: "Facebook", color: "hover:bg-[#1877F2]" },
              { Icon: Twitter, label: "Twitter", color: "hover:bg-[#1DA1F2]" },
              { Icon: Instagram, label: "Instagram", color: "hover:bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]" },
              { Icon: Linkedin, label: "LinkedIn", color: "hover:bg-[#0A66C2]" }
            ].map(({ Icon, label, color }) => (
              <Link key={label} href="#" className={`bg-white/10 p-2.5 rounded-full text-white/80 transition-all hover:scale-110 hover:text-white hover:shadow-lg hover:shadow-white/10 ${color}`}>
                <Icon className="h-5 w-5" />
                <span className="sr-only">{label}</span>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          <h3 className="text-lg font-bold tracking-wide text-white border-b border-white/10 pb-2 inline-block">Quick Links</h3>
          <ul className="space-y-3 text-lime-100">
            {[
              { href: "/about", label: "About Us" },
              { href: "/programs", label: "Our Programs" },
              { href: "/events", label: "Upcoming Events" },
              { href: "/blog", label: "Latest News" },
              { href: "/privacy", label: "Privacy Policy" },
              { href: "/terms", label: "Terms of Service" },
              { href: "/admin", label: "Admin" }
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-lime-300 transition-all flex items-center gap-2 group">
                  <span className="h-1.5 w-1.5 bg-lime-500 rounded-full group-hover:w-3 transition-all duration-300" /> 
                  <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold tracking-wide text-white border-b border-white/10 pb-2 inline-block">Get Involved</h3>
          <ul className="space-y-3 text-lime-100">
            {[
              { href: "/donate", label: "Donate" },
              { href: "/get-involved", label: "Volunteer" },
              { href: "/contact", label: "Contact Us" }
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-lime-300 transition-all flex items-center gap-2 group">
                  <span className="h-1.5 w-1.5 bg-green-500 rounded-full group-hover:w-3 transition-all duration-300" /> 
                  <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold tracking-wide text-white border-b border-white/10 pb-2 inline-block">Contact Info</h3>
          <ul className="space-y-4 text-lime-100">
            <li className="flex items-start gap-3 group">
              <div className="p-2 rounded-full bg-white/5 group-hover:bg-lime-500/20 transition-colors">
                <MapPin className="h-5 w-5 shrink-0 text-lime-400 group-hover:text-lime-300" />
              </div>
              <span className="mt-1 whitespace-pre-line">{contactInfo.address}</span>
            </li>
            <li className="flex items-center gap-3 group">
              <div className="p-2 rounded-full bg-white/5 group-hover:bg-lime-500/20 transition-colors">
                <Phone className="h-5 w-5 shrink-0 text-lime-400 group-hover:text-lime-300" />
              </div>
              <span>{contactInfo.phone}</span>
            </li>
            <li className="flex items-center gap-3 group">
              <div className="p-2 rounded-full bg-white/5 group-hover:bg-lime-500/20 transition-colors">
                <Mail className="h-5 w-5 shrink-0 text-lime-400 group-hover:text-lime-300" />
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
