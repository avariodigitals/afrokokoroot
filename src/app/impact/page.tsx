import Link from "next/link"
import { Metadata } from "next"
import { BarChart, Heart, Users, Globe, ArrowRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { impactMetrics } from "@/lib/data"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Our Impact",
  description: "See the measurable change we are making in the community through music education and cultural events.",
  openGraph: {
    title: "Our Impact | Afrokokoroot Foundation",
    description: "See the measurable change we are making in the community through music education and cultural events.",
    url: `${siteConfig.url}/impact`,
  },
}

export default function ImpactPage() {
  return (
    <div className="min-h-screen bg-lime-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-green-900 text-white overflow-hidden rounded-b-[3rem] shadow-xl">
        {/* Background Gradient & Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-800 via-green-900 to-lime-950 opacity-95" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />
        
        {/* Animated Blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-lime-500/20 rounded-full blur-3xl animate-pulse mix-blend-screen translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-500/20 rounded-full blur-3xl animate-pulse mix-blend-screen -translate-x-1/3 translate-y-1/4 delay-1000" />

        <div className="container relative z-10 text-center max-w-4xl space-y-6">
          <div className="inline-flex items-center rounded-full border border-lime-400/30 bg-lime-400/10 px-4 py-1.5 text-sm font-medium text-lime-200 backdrop-blur-md shadow-lg mb-4">
             <BarChart className="h-4 w-4 mr-2 text-lime-400 fill-current animate-pulse" />
             Measurable Change
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight drop-shadow-lg">
            Impact in <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-green-300">Action</span>
          </h1>
          <p className="text-xl md:text-2xl text-lime-100 font-medium max-w-3xl mx-auto leading-relaxed opacity-90">
            Beyond the music, we measure our success by the lives transformed, communities united, and cultural bridges built.
          </p>
        </div>
      </section>

      {/* Key Metrics Grid */}
      <section className="py-20 container relative z-20 -mt-20 pt-[12rem]">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {impactMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-xl border border-lime-100 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300 group">
              <div className="h-16 w-16 rounded-full bg-lime-50 flex items-center justify-center mb-6 group-hover:bg-lime-100 transition-colors">
                 {index === 0 && <Users className="h-8 w-8 text-green-600" />}
                 {index === 1 && <Globe className="h-8 w-8 text-lime-600" />}
                 {index === 2 && <Heart className="h-8 w-8 text-emerald-600" />}
                 {index === 3 && <BarChart className="h-8 w-8 text-green-700" />}
              </div>
              <div className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-900 to-lime-800 mb-2">
                {metric.value}
              </div>
              <div className="text-lg font-bold text-green-900 mb-2">{metric.label}</div>
              <p className="text-sm text-green-600/80 leading-relaxed">
                {metric.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Stories */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-lime-100/50 to-transparent -z-10" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-green-200/40 rounded-full blur-3xl mix-blend-multiply animate-pulse" />

        <div className="container">
          <div className="text-center mb-16 space-y-4">
             <span className="text-green-600 font-bold tracking-wider uppercase text-sm">Real Stories</span>
             <h2 className="text-3xl md:text-5xl font-black tracking-tight text-green-900">Voices of Change</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
             <div className="relative group">
                 <div className="absolute inset-0 bg-gradient-to-br from-lime-400 to-green-500 rounded-[2rem] blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                 <div className="aspect-square bg-green-900 rounded-[2rem] overflow-hidden relative shadow-2xl border-4 border-white transform group-hover:rotate-1 transition-transform duration-500">
                     <div className="absolute inset-0 flex items-center justify-center text-white/30 font-bold text-xl">
                       <span className="sr-only">Student performing</span>
                       [Image Placeholder: Saxophonist]
                     </div>
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                 </div>
             </div>
             <div className="space-y-8">
               <Quote className="h-12 w-12 text-lime-400 opacity-50" />
               <blockquote className="text-2xl md:text-3xl font-bold text-green-900 leading-tight">
               &quot;Before attending the Afrokokoroot youth music workshop, I was shy and unsure of myself. Being surrounded by music and creative expression helped me find my confidence and connect with others through rhythm.&quot;
              </blockquote>
               <div>
                 <p className="font-bold text-lg text-green-900">– Michael, Age 16</p>
                 <p className="text-green-600">Community Program Participant</p>
               </div>
               <div className="h-1 w-20 bg-gradient-to-r from-lime-400 to-green-500 rounded-full" />
               <p className="text-lg text-green-800/80 leading-relaxed">
                 Through our youth engagement programs, we provide opportunities for young people in Nashville to explore music, creativity, and cultural expression while building confidence and leadership.
               </p>
             </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
             <div className="order-2 md:order-1 space-y-8">
               <Quote className="h-12 w-12 text-emerald-400 opacity-50" />
               <blockquote className="text-2xl md:text-3xl font-bold text-green-900 leading-tight">
               &quot;The World Peace Music & Arts event opened my eyes to how powerful music and culture can be in bringing people together. Seeing people from different backgrounds celebrate together was unforgettable.&quot;
              </blockquote>
               <div>
                 <p className="font-bold text-lg text-green-900">– Sarah J.</p>
                 <p className="text-green-600">Event Attendee</p>
               </div>
               <div className="h-1 w-20 bg-gradient-to-r from-emerald-400 to-lime-500 rounded-full" />
               <p className="text-lg text-green-800/80 leading-relaxed">
                 Our events create spaces where diverse communities come together through music, art, and shared cultural experiences—building understanding and lasting connections.
               </p>
             </div>
             <div className="order-1 md:order-2 relative group">
                 <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-lime-500 rounded-[2rem] blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                 <div className="aspect-square bg-green-900 rounded-[2rem] overflow-hidden relative shadow-2xl border-4 border-white transform group-hover:-rotate-1 transition-transform duration-500">
                     <div className="absolute inset-0 flex items-center justify-center text-white/30 font-bold text-xl">
                       <span className="sr-only">Festival Crowd</span>
                       [Image Placeholder: Festival Crowd]
                     </div>
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                 </div>
             </div>
          </div>
        </div>
      </section>

      {/* Transparency Section */}
      <section className="py-24 bg-lime-50 relative overflow-hidden rounded-b-[3rem] shadow-xl">


        <div className="container relative z-10 text-center pt-10">
          <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-12 shadow-2xl border border-lime-100 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-lime-400 via-green-500 to-emerald-600" />
             
             <BarChart className="h-16 w-16 text-green-500 mx-auto mb-6" />
             <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6 text-green-900">Radical Transparency</h2>
             <p className="text-xl text-green-800/70 mb-10 max-w-2xl mx-auto">
               We believe in full accountability. Every dollar donated helps us keep the rhythm alive. Review our annual impact reports to see exactly how your support is being used.
             </p>
             
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Button size="lg" variant="outline" className="border-2 border-green-100 text-green-700 hover:bg-green-50 hover:border-green-300 h-14 px-8 rounded-full text-lg font-bold">
                 Download 2024 Report (PDF)
               </Button>
               <Button size="lg" className="bg-green-900 text-white hover:bg-green-800 h-14 px-8 rounded-full text-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                 View IRS 990 Form <ArrowRight className="ml-2 h-5 w-5" />
               </Button>
             </div>
          </div>
        </div>

        {/* Wave Divider Bottom */}
      </section>
      
      {/* CTA */}
      <section className="py-24 bg-green-950 text-white text-center relative overflow-hidden rounded-b-[3rem] shadow-xl">

        {/* Background Patterns */}
        <div className="absolute inset-0 bg-[url('/pattern-grid.svg')] opacity-5 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-br from-green-800 via-green-900 to-lime-950 opacity-90" />
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-lime-500/20 rounded-full blur-3xl animate-pulse" />
        
        <div className="container max-w-3xl relative z-10">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8 drop-shadow-sm">Be Part of Our Story</h2>
          <p className="text-xl md:text-2xl text-lime-100/90 mb-10 font-medium max-w-2xl mx-auto">
            Your contribution empowers us to reach more students, host more community events, and keep the culture alive.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button variant="secondary" size="lg" className="shadow-2xl hover:scale-105 transition-transform font-bold px-10 h-16 text-lg rounded-full bg-white text-green-900 hover:bg-lime-50" asChild>
              <Link href="/donate">Make a Donation</Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-transparent border-2 border-lime-200/30 text-white hover:bg-white/10 hover:text-white font-bold px-10 h-16 text-lg rounded-full backdrop-blur-sm" asChild>
              <Link href="/get-involved">Volunteer With Us</Link>
            </Button>
          </div>
        </div>

        {/* Wave Divider to Footer (Dark Indigo) */}
      </section>

    </div>
  )
}
