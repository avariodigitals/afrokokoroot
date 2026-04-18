import Image from "next/image"
import Link from "next/link"
import { Metadata } from "next"
import { Calendar, MapPin, ArrowRight, Clock, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getEvents, getPublicSiteUrl } from "@/lib/api"
import { Event } from "@/lib/types"

export async function generateMetadata(): Promise<Metadata> {
  const publicSiteUrl = await getPublicSiteUrl()

  return {
    title: "Events",
    description: "Join us for our upcoming events, workshops, and performances celebrating African culture and community.",
    openGraph: {
      title: "Events | Afrokokoroot Foundation",
      description: "Join us for our upcoming events, workshops, and performances celebrating African culture and community.",
      url: `${publicSiteUrl}/events`,
    },
  }
}

export const dynamic = 'force-dynamic'

export default async function EventsPage() {
  const events = await getEvents()

  return (
    <div className="min-h-screen bg-lime-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-green-900 text-white overflow-hidden rounded-b-[3rem] shadow-xl z-20">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop"
            alt="Community events and celebration"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-green-800/80 to-lime-900/80" />
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />
        </div>
        
        {/* Animated Blobs */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-lime-500/30 rounded-full blur-3xl animate-pulse mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-green-600/30 rounded-full blur-3xl animate-pulse mix-blend-screen delay-1000" />

        <div className="container relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-lg">
            Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-green-200">Events</span>
          </h1>
          <p className="text-xl md:text-2xl text-lime-100 max-w-3xl mx-auto font-light leading-relaxed">
            Experience the rhythm, culture, and community. Join us at our next gathering and be part of the movement.
          </p>
        </div>
      </section>

      {/* Events List */}
      <section className="py-12 md:py-24 container relative z-10">
        <div className="grid gap-12">
          {events.map((event: Event) => (
            <div key={event.slug} className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-lime-100 flex flex-col md:flex-row">
              {/* Date Badge (Absolute) */}
              <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm rounded-xl p-3 text-center shadow-sm border border-lime-50">
                <span className="block text-xs font-bold uppercase text-green-600 tracking-wider">
                  {event.date.split(' ')[0]}
                </span>
                <span className="block text-2xl font-black text-green-900 leading-none">
                  {event.date.split(' ')[1].replace(',', '')}
                </span>
              </div>

              {/* Image Side */}
              <div className="md:w-2/5 min-h-[300px] relative overflow-hidden">
                {event.image ? (
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-lime-200 animate-pulse" />
                    {/* Placeholder for event image */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-500 to-lime-600 group-hover:scale-110 transition-transform duration-700">
                       <Calendar className="h-24 w-24 text-white/20" />
                    </div>
                  </>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </div>

              {/* Content Side */}
              <div className="flex-1 p-8 md:p-10 flex flex-col justify-between relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Ticket className="h-32 w-32 text-green-900 rotate-12" />
                </div>
                
                <div className="relative z-10 space-y-4">
                  <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
                    <span className="flex items-center bg-lime-50 text-green-700 px-3 py-1 rounded-full">
                      <Clock className="h-4 w-4 mr-2" />
                      {event.date.split(' at ')[1] || 'TBA'}
                    </span>
                    <span className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location}
                    </span>
                  </div>

                  <h2 className="text-3xl font-bold group-hover:text-green-700 transition-colors">
                    <Link href={`/events/${event.slug}`} className="focus:outline-none">
                      <span className="absolute inset-0 md:hidden" />
                      {event.title}
                    </Link>
                  </h2>
                  
                  <p className="text-lg text-muted-foreground line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-8 relative z-10 pt-6 border-t border-lime-50">
                   <div className="text-lg font-bold text-green-900">
                     {event.price === 'Free' ? (
                       <span className="text-green-600">Free Entry</span>
                     ) : (
                       event.price
                     )}
                   </div>
                   
                   <Button asChild size="lg" className="rounded-full px-8 bg-green-600 hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5 transition-all text-white">
                    <Link href={`/events/${event.slug}`}>
                      View Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 container relative z-10">
         <div className="bg-gradient-to-r from-green-600 to-lime-600 rounded-[3rem] p-10 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
           <div className="absolute inset-0 bg-[url('/pattern-grid.svg')] opacity-20 mix-blend-overlay" />
           <div className="absolute -left-20 top-1/2 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
           
           <div className="relative z-10 max-w-2xl mx-auto space-y-8">
             <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Never Miss a Beat</h2>
             <p className="text-xl text-lime-100 font-medium">
               Subscribe to our newsletter to get the latest updates on events, workshops, and community gatherings.
             </p>
             
             <form className="flex flex-col sm:flex-row gap-4 pt-4 max-w-md mx-auto">
               <input 
                 type="email" 
                 placeholder="Enter your email" 
                 className="flex-1 h-14 px-6 rounded-full bg-white/10 border border-white/30 text-white placeholder:text-lime-100 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all backdrop-blur-sm"
               />
               <Button size="lg" className="h-14 px-8 rounded-full bg-white text-green-700 hover:bg-lime-50 font-bold shadow-lg">
                 Subscribe
               </Button>
             </form>
           </div>
         </div>
      </section>
      
      {/* Wave Divider to Footer (Dark Indigo) */}
    </div>

  )
}
