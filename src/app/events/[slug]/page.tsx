import { notFound } from "next/navigation"
import Link from "next/link"
import { Metadata } from "next"
import { Calendar, MapPin, Clock, ArrowLeft, Share2, Ticket, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getEvents } from "@/lib/api"
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

  if (!event) {
    notFound()
  }

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

      <div className="container py-12 lg:py-20 grid lg:grid-cols-3 gap-12 -mt-20 relative z-20">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-lime-100/50 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-100/40 to-transparent rounded-bl-full -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-700" />
            
            <section className="relative mb-12">
              <h2 className="text-3xl font-bold mb-6 text-green-950 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-lime-600" />
                About the Event
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                {event.description}
              </p>
            </section>

            {event.highlights && (
              <section className="relative">
                <h2 className="text-2xl font-bold mb-6 text-green-950">Event Highlights</h2>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {event.highlights.map((highlight: string, index: number) => (
                    <li key={index} className="flex items-start bg-lime-50/50 p-4 rounded-xl border border-lime-100 hover:border-lime-200 transition-colors">
                      <span className="flex h-3 w-3 translate-y-1.5 rounded-full bg-green-500 mr-3 shadow-sm shadow-green-500/50" />
                      <span className="font-semibold text-slate-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Campaign/Donation Section */}
          <section className="bg-green-900 rounded-3xl p-8 md:p-10 text-center text-white relative overflow-hidden shadow-xl">
             <div className="absolute inset-0 bg-[url('/pattern-grid.svg')] opacity-10 mix-blend-overlay" />
             <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-lime-500/30 rounded-full blur-3xl" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="text-3xl font-bold mb-4">Can&apos;t make it to the event?</h3>
              <p className="text-lime-100/80 mb-8 text-lg leading-relaxed">
                Support the Afrokokoroot Foundation&apos;s mission by making a donation. Your contribution helps us keep our programs accessible to the community.
              </p>
              <Button size="lg" className="bg-lime-500 hover:bg-lime-600 text-green-900 font-bold h-14 px-8 rounded-full shadow-lg shadow-lime-500/20 text-lg hover:-translate-y-0.5 transition-all" asChild>
                <Link href="/donate">Donate Now</Link>
              </Button>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="sticky top-24">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-lime-100/50 space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-6 text-green-950 border-b border-lime-100 pb-4">Event Details</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between py-2 border-b border-dashed border-slate-200">
                    <span className="text-slate-500 font-medium">Date</span>
                    <span className="font-bold text-green-900">{event.date}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-dashed border-slate-200">
                    <span className="text-slate-500 font-medium">Time</span>
                    <span className="font-bold text-green-900">{event.time}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-dashed border-slate-200">
                    <span className="text-slate-500 font-medium">Cost</span>
                    <span className="font-bold text-green-600">{event.price}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-green-950">Location</h3>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="font-semibold text-green-900 mb-1">{event.location}</p>
                  <p className="text-sm text-slate-500">{event.address}</p>
                </div>
                <div className="aspect-video bg-lime-50 rounded-xl border border-lime-100 flex items-center justify-center text-xs text-green-400 font-medium uppercase tracking-wider">
                  [Map Placeholder]
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <EventActions event={{
                  title: event.title,
                  date: event.date,
                  time: event.time,
                  location: event.location,
                  ticketPrice: event.ticketPrice,
                  slug: event.slug,
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
