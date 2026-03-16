import Image from "next/image"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Metadata } from "next"
import { Calendar, MapPin, Clock, ArrowLeft, Sparkles, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Gallery } from "@/components/sections/Gallery"
import { getEvents, getGalleryItems } from "@/lib/api"
import { Event } from "@/lib/types"
import { siteConfig } from "@/lib/site-config"
import JsonLd from "@/components/ui/JSONLD"
import { EventActions } from "@/components/events/EventActions"

interface EventPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params
  const events = await getEvents()
  const event = events.find((e: Event) => e.slug === slug)

  if (!event) {
    return {
      title: "Event Not Found",
      description: "The requested event could not be found.",
    }
  }

  return {
    title: event.title,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      type: "website",
      url: `${siteConfig.url}/events/${event.slug}`,
      images: [
        {
          url: event.image || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: event.description,
      images: [event.image || siteConfig.ogImage],
    },
  }
}

export async function generateStaticParams() {
  const events = await getEvents()
  return events.map((event: Event) => ({
    slug: event.slug,
  }))
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params
  const events = await getEvents()
  const event = events.find((e: Event) => e.slug === slug)
  const galleryItems = await getGalleryItems()

  if (!event) {
    notFound()
  }

  // Group artists by stage
  const artistsByStage = event.artists?.reduce((acc, artist) => {
    const stage = artist.stage || 'Featured'
    if (!acc[stage]) acc[stage] = []
    acc[stage].push(artist)
    return acc
  }, {} as Record<string, typeof event.artists>)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.date,
    location: {
      "@type": "Place",
      name: event.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.location,
      },
    },
    image: [event.image || siteConfig.ogImage],
    organizer: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  }

  return (
    <div className="min-h-screen bg-lime-50/30 font-sans selection:bg-lime-200">
      <JsonLd data={jsonLd} />
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-lime-900 to-emerald-900 text-white">
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-soft-light"></div>
          <div className="absolute inset-0 bg-[url('/pattern-grid.svg')] opacity-10"></div>
          
          {/* Animated Blobs */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-lime-500/30 rounded-full blur-3xl animate-pulse mix-blend-screen" />
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-green-500/30 rounded-full blur-3xl animate-pulse delay-1000 mix-blend-screen" />
        </div>

        <div className="container relative z-10">
          <Link 
            href="/events" 
            className="inline-flex items-center text-sm font-medium text-lime-100 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Events
          </Link>
          
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="bg-green-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-green-600/20 animate-pulse">
                Upcoming Event
              </span>
              <span className="flex items-center text-lime-100 text-sm font-medium bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20">
                <Calendar className="mr-2 h-4 w-4" />
                {event.date}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-lime-100 to-lime-200 mb-6 drop-shadow-sm leading-tight">
              {event.title}
            </h1>
            
            <div className="flex flex-wrap gap-6 text-lg font-medium text-lime-100/90">
              <span className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-lime-400" />
                {event.time}
              </span>
              <span className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-lime-400" />
                {event.location}
              </span>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 text-lime-50/30">
          <svg className="w-full h-full fill-current" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      <div className="container py-12 lg:py-20 max-w-6xl -mt-20 relative z-20">
        {/* Main Content Flow */}
        <div className="space-y-16">
          {/* About Section */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-lime-100/50 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-100/40 to-transparent rounded-bl-full -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-700" />
            
            <section className="relative">
              <h2 className="text-3xl font-bold mb-6 text-green-950 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-lime-600" />
                About the Event
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-12">
                {event.description}
              </p>

              {event.highlights && (
                <div className="relative">
                  <h3 className="text-2xl font-bold mb-6 text-green-950">Event Highlights</h3>
                  <ul className="grid sm:grid-cols-2 gap-4">
                    {event.highlights.map((highlight: string, index: number) => (
                      <li key={index} className="flex items-start bg-lime-50/50 p-4 rounded-xl border border-lime-100 hover:border-lime-200 transition-colors">
                        <span className="flex h-3 w-3 translate-y-1.5 rounded-full bg-green-500 mr-3 shadow-sm shadow-green-500/50" />
                        <span className="font-semibold text-slate-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          </div>

          {/* Venue + Details Section */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-lime-100/50">
            <h2 className="text-3xl font-bold mb-8 text-green-950">Venue & Details</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
              <div className="space-y-2 p-6 rounded-2xl bg-lime-50/50 border border-lime-100">
                <Calendar className="h-8 w-8 text-lime-600 mx-auto md:mx-0 mb-4" />
                <h3 className="text-lg font-bold text-green-950">Date</h3>
                <p className="text-slate-600 font-medium">{event.date}</p>
              </div>
              <div className="space-y-2 p-6 rounded-2xl bg-lime-50/50 border border-lime-100">
                <Clock className="h-8 w-8 text-lime-600 mx-auto md:mx-0 mb-4" />
                <h3 className="text-lg font-bold text-green-950">Time</h3>
                <p className="text-slate-600 font-medium">{event.time}</p>
              </div>
              <div className="space-y-2 p-6 rounded-2xl bg-lime-50/50 border border-lime-100">
                <MapPin className="h-8 w-8 text-lime-600 mx-auto md:mx-0 mb-4" />
                <h3 className="text-lg font-bold text-green-950">Location</h3>
                <p className="text-slate-600 font-bold">{event.location}</p>
                <p className="text-sm text-slate-500">{event.address}</p>
              </div>
            </div>
          </div>

          {/* Artist Performing Section */}
          {artistsByStage && Object.keys(artistsByStage).length > 0 && (
            <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-lime-100/50">
              <h2 className="text-3xl font-bold mb-12 text-green-950 text-center">Performers Lineup</h2>
              <div className="space-y-16">
                {Object.entries(artistsByStage).map(([stage, artists]) => (
                  <div key={stage} className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="h-px flex-1 bg-lime-200" />
                      <h3 className="text-2xl font-black text-lime-600 tracking-widest uppercase">{stage}</h3>
                      <div className="h-px flex-1 bg-lime-200" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
                      {artists?.map((artist, index) => (
                        <div key={index} className="group text-center">
                          <div className="relative w-full aspect-square rounded-full overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105 mb-4 bg-lime-50">
                            {artist.image ? (
                              <Image src={artist.image} alt={artist.name || 'Artist'} fill className="object-cover transition-opacity duration-300 group-hover:opacity-90 rounded-full" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-green-100 to-lime-100 flex items-center justify-center">
                                <User className="w-1/2 h-1/2 text-green-400" />
                              </div>
                            )}
                          </div>
                          {artist.name && <h4 className="font-bold text-sm text-slate-800 tracking-tight leading-tight">{artist.name}</h4>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Past Event Gallery */}
          <section className="bg-lime-50/50 rounded-3xl p-8 md:p-12 border border-lime-100">
            <h2 className="text-3xl font-bold mb-6 text-green-950">Past Event Moments</h2>
            <p className="text-slate-600 mb-8 text-lg">A glimpse into our previous celebrations and community gatherings.</p>
            <Gallery hideTitle={true} initialItems={galleryItems.slice(0, 4)} />
            <div className="mt-8 text-center">
              <Button variant="outline" asChild className="rounded-full border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800">
                <Link href="/gallery">View Full Gallery</Link>
              </Button>
            </div>
          </section>

          {/* Sponsors Section */}
          {event.sponsors && event.sponsors.length > 0 && (
            <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-lime-100/50">
              <h2 className="text-3xl font-bold mb-10 text-green-950 text-center">Our Sponsors</h2>
              <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
                {event.sponsors.map((sponsor, index) => (
                  <div key={index} className="group">
                    {sponsor.image ? (
                      <div className="relative h-20 w-40 grayscale opacity-70 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110">
                         <Image src={sponsor.image} alt={sponsor.name || 'Sponsor'} fill className="object-contain" />
                      </div>
                    ) : (
                       sponsor.name && <p className="text-xl font-bold text-slate-400 group-hover:text-green-700 transition-colors uppercase tracking-widest">{sponsor.name}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Partners Logo Section */}
          {event.partners && event.partners.length > 0 && (
            <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-lime-100/50">
              <h2 className="text-3xl font-bold mb-10 text-green-950 text-center">Community Partners</h2>
              <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
                {event.partners.map((partner, index) => (
                  <div key={index} className="group">
                    {partner.image ? (
                      <div className="relative h-16 w-32 grayscale opacity-60 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100">
                         <Image src={partner.image} alt={partner.name || 'Partner'} fill className="object-contain" />
                      </div>
                    ) : (
                       partner.name && <p className="text-lg font-bold text-slate-400 group-hover:text-lime-600 transition-colors uppercase tracking-widest">{partner.name}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Map Section */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-lime-100/50 space-y-6">
            <h2 className="text-3xl font-bold text-green-950">How to Find Us</h2>
            <div className="aspect-[21/9] bg-lime-50 rounded-2xl border border-lime-100 flex items-center justify-center text-sm text-green-400 font-bold uppercase tracking-widest overflow-hidden relative group">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2066&auto=format&fit=crop')] bg-cover bg-center opacity-20 group-hover:scale-105 transition-transform duration-1000" />
              <div className="relative z-10 bg-white/80 backdrop-blur-md px-8 py-4 rounded-full border border-lime-200 text-green-900 shadow-xl">
                Nashville, Tennessee - Afrokokoroot Haven
              </div>
            </div>
          </div>

          {/* Registration Section */}
          <section className="bg-green-900 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
             <div className="absolute inset-0 bg-[url('/pattern-grid.svg')] opacity-10 mix-blend-overlay" />
             <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-lime-500/20 rounded-full blur-3xl" />
            
            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight">Reserve Your Spot</h2>
                <p className="text-lime-100/80 text-xl leading-relaxed">
                  Join us for the World Peace Awakening 2026. Secure your tickets now to be part of this unforgettable cultural experience.
                </p>
              </div>
              
              <div className="pt-4">
                <EventActions event={{
                  title: event.title,
                  date: event.date,
                  time: event.time,
                  location: event.location,
                  ticketPrice: event.ticketPrice,
                  slug: event.slug,
                }} />
              </div>
              
              <div className="pt-8 border-t border-white/10">
                <p className="text-sm text-lime-200/60 mb-6 uppercase tracking-widest font-bold">Can&apos;t make it? Support our mission</p>
                <Button size="lg" className="bg-lime-500 hover:bg-lime-600 text-green-900 font-bold h-14 px-10 rounded-full shadow-lg shadow-lime-500/20 text-lg hover:-translate-y-1 transition-all" asChild>
                  <Link href="/donate">Donate Now</Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
