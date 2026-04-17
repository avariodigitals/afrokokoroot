import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import DecorativeTitle from "@/components/ui/DecorativeTitle"
import { ArrowRight, Globe, Heart, Users } from "lucide-react"

interface HeroProps {
  badgeText?: string
  title?: string
  subtitle?: string
  heroImage?: string
  ctaPrimaryLabel?: string
  ctaPrimaryHref?: string
  ctaSecondaryLabel?: string
  ctaSecondaryHref?: string
}

export function Hero({
  badgeText = 'Official 501(c)(3) Nonprofit Organization',
  title = 'Where Culture, Creativity, and Community Take Root',
  subtitle = 'Join us in preserving heritage, promoting unity, and creating opportunities for the next generation.',
  heroImage = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop',
  ctaPrimaryLabel = 'Donate Now',
  ctaPrimaryHref = '/donate',
  ctaSecondaryLabel = 'Join Our Programs',
  ctaSecondaryHref = '/programs'
}: HeroProps) {
  return (
    <section className="relative w-full py-24 md:py-28 lg:py-32 overflow-hidden bg-black rounded-b-[3rem] shadow-2xl z-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt="Hero background"
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-green-950/90 via-black/60 to-black/40" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="container relative z-10 flex flex-col items-center text-center space-y-10 lg:space-y-8">
        
        {/* Badge */}
        <div className="inline-flex items-center rounded-full border border-lime-200/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md shadow-lg animate-fade-in-up">
          <span className="flex h-2 w-2 rounded-full bg-[#E9A907] mr-2 animate-pulse shadow-[0_0_10px_#E9A907]"></span>
          {badgeText}
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl leading-[1.1] drop-shadow-sm">
          <DecorativeTitle text={title} variant="hero" />
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-2xl text-lime-50 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md">
          {subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto pt-4">
          <Button asChild size="lg" className="text-lg px-10 h-16 rounded-full bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700 text-white shadow-xl shadow-green-900/20 border-none transition-transform hover:scale-105">
            <Link href={ctaPrimaryHref}>
              {ctaPrimaryLabel} <Heart className="ml-2 h-5 w-5 fill-current" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-10 h-16 rounded-full border-2 border-white/30 bg-white/5 text-white hover:bg-lime-600 hover:border-lime-600 backdrop-blur-sm transition-transform hover:scale-105">
            <Link href={ctaSecondaryHref}>
              {ctaSecondaryLabel} <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Stats / Trust Indicators */}
        <div className="pt-16 lg:pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 text-center">
          {[
            { icon: Globe, label: "Cultural Arts", color: "text-lime-400" },
            { icon: Heart, label: "Global Reach", color: "text-green-400" },
            { icon: Users, label: "Community", color: "text-lime-300" },
            { icon: Heart, label: "Impact", color: "text-green-300" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-3 group">
               <div className={`p-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm group-hover:bg-white/10 transition-colors ${stat.color}`}>
                 <stat.icon className="h-6 w-6" />
               </div>
               <span className="font-bold text-white/90 tracking-wide text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
