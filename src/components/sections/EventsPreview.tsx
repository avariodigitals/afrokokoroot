import Link from "next/link"
import { MapPin, ArrowRight, Clock, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getEvents } from "@/lib/api"
import { Event } from "@/lib/types"

export async function EventsPreview() {
  const events = await getEvents()

  return (
    <section className="py-24 bg-green-50 relative overflow-hidden rounded-b-[3rem] shadow-xl">
      {/* Musical Flow Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-green-100/50 via-transparent to-transparent opacity-70" />
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-lime-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-800 to-lime-600">Upcoming Events</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Join the rhythm. Experience the culture. Be part of the community.
            </p>
          </div>
          <Button asChild variant="outline" className="hidden md:inline-flex group border-green-200 hover:border-green-400 text-green-700 hover:bg-green-50 rounded-full px-6">
            <Link href="/events">
              View All Events <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {events.slice(0, 2).map((event: Event) => (
            <div key={event.slug} className="group relative bg-white border border-green-100 rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col md:flex-row h-full">
              {/* Image Section */}
              <div className="md:w-5/12 h-64 md:h-auto relative overflow-hidden bg-green-900">
                {/* Fallback Pattern */}
                <div className="absolute inset-0 bg-[url('/pattern-grid.svg')] opacity-20" />
                
                {/* Background Image with Fallback */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${event.image})` }}
                />
                <div className="absolute inset-0 bg-green-900/10 group-hover:bg-green-900/0 transition-colors duration-300" />
                
                {/* Date Badge */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 text-center shadow-lg border border-green-50 min-w-[70px]">
                  <span className="block text-xs font-bold text-green-600 uppercase tracking-wider mb-1">{event.date.split(' ')[0]}</span>
                  <span className="block text-2xl font-black text-green-950 leading-none">{event.date.split(' ')[1].replace(',', '')}</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-between relative bg-white">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-green-600 uppercase tracking-wider mb-3">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Live Event
                  </div>
                  
                  <h3 className="text-2xl font-bold text-green-950 mb-3 group-hover:text-green-600 transition-colors leading-tight">
                    <Link href={`/events/${event.slug}`} className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {event.title}
                    </Link>
                  </h3>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-start gap-2 text-sm text-slate-600">
                      <Clock className="h-4 w-4 shrink-0 text-green-400 mt-0.5" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-slate-600">
                      <MapPin className="h-4 w-4 shrink-0 text-green-400 mt-0.5" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-green-50 mt-auto">
                   <div className="flex flex-col">
                     <span className="text-xs text-slate-400 font-medium uppercase">Price</span>
                     <span className="font-bold text-lg text-green-900">{event.price.split(' ')[0]}</span>
                   </div>
                   <span className="h-10 px-5 rounded-full bg-green-50 text-green-700 font-bold text-sm flex items-center group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                     Get Tickets <Ticket className="ml-2 h-4 w-4" />
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 md:hidden text-center">
          <Button asChild variant="outline" className="w-full border-indigo-200 text-indigo-700 rounded-full">
            <Link href="/events">View All Events</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
