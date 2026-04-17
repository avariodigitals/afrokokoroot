import Image from "next/image"
import Link from "next/link"
import { Metadata } from "next"
import { ArrowRight, Heart, Sparkles, Sprout, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import DecorativeTitle from "@/components/ui/DecorativeTitle"
import { siteConfig } from "@/lib/site-config"
import { getPageContent, getPrograms } from "@/lib/api"
import { Program } from "@/lib/types"

export const metadata: Metadata = {
  title: "Programs",
  description: "Explore our diverse range of educational and artistic programs designed to preserve African heritage and empower communities.",
  openGraph: {
    title: "Programs | Afrokokoroot Foundation",
    description: "Explore our diverse range of educational and artistic programs designed to preserve African heritage and empower communities.",
    url: `${siteConfig.url}/programs`,
  },
}

const iconMap = [Sparkles, Heart, Sprout, Globe]

export default async function ProgramsPage() {
  const page = await getPageContent('programs')
  const content = page?.content || {}
  const programs = await getPrograms()

  return (
    <div className="min-h-screen bg-lime-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-green-800 text-white overflow-hidden rounded-b-[3rem] shadow-xl">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src={page?.heroImage || 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop'}
            alt="Music education and instruments"
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-green-800/80 to-lime-900/80" />
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />
        </div>
        
        {/* Animated Blobs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-lime-500/30 rounded-full blur-3xl animate-pulse mix-blend-screen" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-green-600/30 rounded-full blur-3xl animate-pulse mix-blend-screen delay-1000" />

        <div className="container relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-lg">
            <DecorativeTitle text={page?.heroTitle || 'Our Programs'} variant="hero" />
          </h1>
          <p className="text-xl md:text-2xl text-lime-50 max-w-3xl mx-auto font-light leading-relaxed">
            {page?.heroSubtitle || 'We are dedicated to preserving African heritage and empowering communities through four core pillars of impact.'}
          </p>
        </div>
      </section>

      {/* Programs List */}
      <section className="py-12 md:py-24 container relative z-10">
        <div className="text-center mb-16">
          <p className="text-lg text-green-700 font-semibold mb-3">
            {content?.programListHeadline || 'Featured Programs'}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-green-900">
            <DecorativeTitle text={content?.programIntro || 'Our programs connect culture, learning and health through creative workshops, mentorship, and community support.'} />
          </h2>
        </div>
        <div className="grid gap-16 md:gap-32">
          {programs.map((program: Program, index) => {
            const Icon = iconMap[index % iconMap.length]
            const isEven = index % 2 === 0
            const details = (program.content || '')
              .split(/[\n.]+/)
              .map((item) => item.trim())
              .filter(Boolean)
              .slice(0, 4)

            return (
              <div key={program.slug} className={`flex flex-col md:flex-row gap-12 items-center ${!isEven ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Image Side */}
                <div className="w-full md:w-1/2 relative group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${isEven ? 'from-green-400 to-lime-500' : 'from-lime-500 to-green-600'} rounded-[2rem] blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500`} />
                  <div className="relative aspect-video bg-white rounded-[2rem] overflow-hidden shadow-xl border-4 border-white transform group-hover:scale-[1.02] transition-transform duration-500">
                     {/* Program Image */}
                     <Image
                      src={program.image || 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop'}
                        alt={program.title}
                        fill
                        className="object-cover"
                      />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                        <span className="text-white font-bold text-lg">Explore {program.title}</span>
                     </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="w-full md:w-1/2 space-y-6">
                  <div className={`inline-flex items-center justify-center h-16 w-16 rounded-2xl ${isEven ? 'bg-lime-100 text-green-700' : 'bg-green-100 text-green-700'} shadow-sm mb-2 transform hover:rotate-6 transition-transform`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                    {program.title}
                  </h2>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {program.description}
                  </p>
                  
                  <ul className="space-y-3 pt-2">
                    {details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-3 text-muted-foreground font-medium">
                        <Sparkles className={`h-4 w-4 ${isEven ? 'text-lime-600' : 'text-green-600'}`} />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4">
                    <Button asChild size="lg" className={`${isEven ? 'bg-green-600 hover:bg-green-700' : 'bg-lime-600 hover:bg-lime-700'} text-white rounded-full px-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
                      <Link href={`/programs/${program.slug}`}>
                        Get Involved <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
      
      {/* Partner CTA */}
      <section className="py-24 container relative z-10">
        <div className="bg-green-900 rounded-[3rem] p-10 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('/pattern-grid.svg')] opacity-10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse delay-700" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight"><DecorativeTitle text={content?.ctaHeadline || 'Partner With Us'} /></h2>
            <p className="text-xl text-lime-100 leading-relaxed">
              {content?.ctaDescription || 'Interested in bringing one of our programs to your school, community center, or organization? We\'d love to collaborate to spread the rhythm.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
              <Button asChild size="lg" className="bg-white text-green-900 hover:bg-lime-50 rounded-full px-10 font-bold text-lg h-14">
                <Link href="/contact">{content?.ctaPrimaryLabel || 'Contact Us'}</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent border-green-200 text-white hover:bg-white/10 rounded-full px-10 font-bold text-lg h-14">
                <Link href="/donate">{content?.ctaSecondaryLabel || 'Support Our Work'}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
