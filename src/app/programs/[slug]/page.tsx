import { notFound } from "next/navigation"
import Link from "next/link"
import { Metadata } from "next"
import { ArrowLeft, CheckCircle2, Music, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getPrograms } from "@/lib/api"
import { siteConfig } from "@/lib/site-config"
import JsonLd from "@/components/ui/JSONLD"

const DEFAULT_OFFER_ITEMS = [
  'Professional Instruction',
  'Cultural Immersion',
  'Performance Opportunities',
  'Community Building',
  'Skill Development',
  'Mentorship',
]

interface ProgramPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ProgramPageProps): Promise<Metadata> {
  const { slug } = await params
  const programs = await getPrograms()
  const program = programs.find((p) => p.slug === slug)

  if (!program) {
    return {
      title: "Program Not Found",
      description: "The requested program could not be found.",
    }
  }

  return {
    title: program.title,
    description: program.description,
    openGraph: {
      title: program.title,
      description: program.description,
      type: "website",
      url: `${siteConfig.url}/programs/${program.slug}`,
      images: [
        {
          url: program.image || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: program.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: program.title,
      description: program.description,
      images: [program.image || siteConfig.ogImage],
    },
  }
}

export async function generateStaticParams() {
  const programs = await getPrograms()
  return programs.map((program) => ({
    slug: program.slug,
  }))
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const { slug } = await params
  const programs = await getPrograms()
  const program = programs.find((p) => p.slug === slug)

  if (!program) {
    notFound()
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: program.title,
    description: program.description,
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    url: `${siteConfig.url}/programs/${program.slug}`,
  }

  const offerItems = program.offerItems?.length ? program.offerItems : DEFAULT_OFFER_ITEMS
  const overviewSecondary = program.overviewSecondary || `Our ${program.title} is designed to foster creativity, build confidence, and deepen cultural understanding. Through hands-on learning and expert guidance, participants explore the rich traditions of Afrobeat music and dance.`
  const getInvolvedTitle = program.getInvolvedTitle || 'Get Involved'
  const getInvolvedText = program.getInvolvedText || 'Ready to join the experience? Sign up for upcoming workshops, bring a session to your school or organization, or connect with us to learn more.'
  const getInvolvedPrimaryLabel = program.getInvolvedPrimaryLabel || 'Register Now'
  const getInvolvedPrimaryHref = program.getInvolvedPrimaryHref || '/contact'
  const getInvolvedSecondaryLabel = program.getInvolvedSecondaryLabel || 'Request Information'
  const getInvolvedSecondaryHref = program.getInvolvedSecondaryHref || '/contact'
  const supportTitle = program.supportTitle || 'Support This Program'
  const supportText = program.supportText || 'Your donation helps provide scholarships and instruments for students in need.'
  const supportButtonLabel = program.supportButtonLabel || `Donate to ${program.title}`
  const supportButtonHref = program.supportButtonHref || '/donate'

  return (
    <div className="min-h-screen bg-orange-50/30 font-sans selection:bg-orange-200">
      <JsonLd data={jsonLd} />
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-orange-900 text-white">
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-soft-light"></div>
          <div className="absolute inset-0 bg-[url('/pattern-grid.svg')] opacity-10"></div>
          
          {/* Animated Blobs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/30 rounded-full blur-3xl animate-pulse mix-blend-screen" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000 mix-blend-screen" />
        </div>

        <div className="container relative z-10">
          <Link 
            href="/programs" 
            className="inline-flex items-center text-sm font-medium text-orange-100 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Programs
          </Link>
          
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-orange-100 mb-6">
              <Music className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-wide uppercase">Signature Program</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-orange-200 mb-6 drop-shadow-sm">
              {program.title}
            </h1>
            
            <p className="text-xl md:text-2xl text-orange-100/90 max-w-2xl leading-relaxed font-medium">
              {program.description}
            </p>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 text-orange-50/30">
          <svg className="w-full h-full fill-current" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      <div className="container py-12 lg:py-20 grid lg:grid-cols-3 gap-12 -mt-20 relative z-20">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-orange-100/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-100/40 to-transparent rounded-bl-full -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-700" />
            
            <section className="relative mb-12">
              <h2 className="text-3xl font-bold mb-6 text-indigo-950 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-orange-500" />
                Program Overview
              </h2>
              <div className="prose prose-lg text-slate-600 max-w-none">
                <p className="leading-relaxed">{program.content}</p>
                <p className="leading-relaxed mt-4">{overviewSecondary}</p>
              </div>
            </section>

            <section className="relative">
              <h2 className="text-2xl font-bold mb-6 text-indigo-950">What We Offer</h2>
              <ul className="grid sm:grid-cols-2 gap-4">
                {offerItems.map((item, index) => (
                  <li key={index} className="flex items-center gap-3 bg-orange-50/50 p-4 rounded-xl border border-orange-100 hover:border-orange-200 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 text-orange-600">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <span className="font-semibold text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="bg-indigo-900 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-[url('/pattern-grid.svg')] opacity-10 mix-blend-overlay" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                Impact Story
              </h3>
              <blockquote className="text-xl md:text-2xl italic font-medium leading-relaxed opacity-90 mb-6 border-l-4 border-orange-500 pl-6">
                &quot;This program changed my life. I found my rhythm and my community here.&quot;
              </blockquote>
              <cite className="block text-right font-bold text-orange-200 not-italic tracking-wide uppercase text-sm">
                – Program Participant
              </cite>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-orange-100/50">
              <h3 className="text-xl font-bold mb-4 text-indigo-950">{getInvolvedTitle}</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                {getInvolvedText}
              </p>
              <div className="space-y-4">
                <Button className="w-full h-12 text-lg font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all" size="lg" asChild>
                  <Link href={getInvolvedPrimaryHref}>{getInvolvedPrimaryLabel}</Link>
                </Button>
                <Button variant="outline" className="w-full h-12 text-lg font-bold border-2 hover:bg-orange-50" asChild>
                  <Link href={getInvolvedSecondaryHref}>{getInvolvedSecondaryLabel}</Link>
                </Button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-100 to-white rounded-3xl p-8 shadow-lg border border-orange-200">
              <h3 className="text-xl font-bold mb-2 text-indigo-950">{supportTitle}</h3>
              <p className="text-slate-600 mb-6 text-sm">
                {supportText}
              </p>
              <Button variant="secondary" className="w-full bg-orange-500 text-white hover:bg-orange-600 border-none h-12 font-bold shadow-md" asChild>
                <Link href={supportButtonHref}>{supportButtonLabel}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
