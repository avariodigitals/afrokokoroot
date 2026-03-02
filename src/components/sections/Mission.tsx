import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Mission() {
  return (
    <section className="py-24 md:py-32 bg-orange-50 relative overflow-hidden rounded-b-[3rem] shadow-xl">

      {/* Organic Background Shapes */}
      <div className="absolute inset-0 bg-[url('/pattern-grid.svg')] opacity-5" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-100/50 to-transparent -z-10 opacity-60" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-yellow-200/40 rounded-full blur-3xl mix-blend-multiply animate-pulse" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl mix-blend-multiply animate-pulse delay-700" />
      
      <div className="container grid md:grid-cols-2 gap-16 items-center relative z-10">
        <div className="space-y-8">
          <div className="inline-flex items-center rounded-full bg-white px-3 py-1 text-sm font-bold text-orange-600 border border-orange-200 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-orange-500 mr-2 animate-pulse"></span>
            Who We Are
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
            More Than Music. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-indigo-600">A Global Movement.</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            The Afrokokoroot Foundation is a registered 501(c)(3) nonprofit organization committed to transparency, ethical governance, and sustainable community impact.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We believe in the power of Afrobeat music and cultural arts to bridge divides, educate youth, and promote mental wellness. Our programs are designed to be accessible, inclusive, and transformative.
          </p>
          
          <div className="flex flex-col gap-4 pt-2">
             {["501(c)(3) Certified", "Community-Led", "Transparent Governance"].map((item) => (
               <div key={item} className="flex items-center gap-3 group">
                 <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform shadow-sm">
                   <CheckCircle2 className="h-5 w-5" />
                 </div>
                 <span className="font-semibold text-foreground/80 group-hover:text-foreground transition-colors">{item}</span>
               </div>
             ))}
          </div>

          <Button asChild variant="link" className="p-0 h-auto text-lg font-bold text-orange-600 hover:text-orange-700 decoration-2 underline-offset-4">
            <Link href="/about" className="group flex items-center">
              Learn more about our governance
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="relative">
           {/* Abstract Shape Behind Image */}
           <div className="absolute -top-10 -right-10 w-full h-full bg-indigo-600/5 rounded-[3rem] -rotate-6 -z-10" />
           <div className="absolute -bottom-10 -left-10 w-full h-full bg-orange-500/5 rounded-[3rem] rotate-3 -z-10" />
           
           <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-white shadow-2xl shadow-indigo-900/10 border-4 border-white transform hover:scale-[1.02] transition-transform duration-500">
             <Image 
                src="/community%20drumming.jpeg" 
                alt="Community Drumming" 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
           </div>
           
           {/* Floating Card */}
           <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-indigo-50 max-w-xs hidden md:block animate-bounce-slow">
             <div className="flex items-center gap-3 mb-2">
               <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
               <p className="font-bold text-2xl text-indigo-900">10+ Years</p>
             </div>
             <p className="text-sm font-medium text-slate-600">Of uniting communities through rhythm and dance.</p>
           </div>
        </div>
      </div>

      {/* Wave Divider to Impact Section (Secondary Color) */}
    </section>

  )
}
