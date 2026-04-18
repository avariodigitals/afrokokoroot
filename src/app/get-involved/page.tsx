import Image from "next/image"
import Link from "next/link"
import { Metadata } from "next"
import { Users, Heart, Briefcase, Mail, ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import DecorativeTitle from "@/components/ui/DecorativeTitle"
import { getPageContent, getPublicSiteUrl } from "@/lib/api"

export async function generateMetadata(): Promise<Metadata> {
  const publicSiteUrl = await getPublicSiteUrl()

  return {
    title: "Get Involved",
    description: "Join the Afrokokoroot movement. Volunteer, partner, or contribute to our mission.",
    openGraph: {
      title: "Get Involved | Afrokokoroot Foundation",
      description: "Join the Afrokokoroot movement. Volunteer, partner, or contribute to our mission.",
      url: `${publicSiteUrl}/get-involved`,
    },
  }
}

export default async function GetInvolvedPage() {
  const page = await getPageContent('get-involved')
  const content = page?.content || {}
  const partnerImages = Array.isArray(content?.partnerImages)
    ? content.partnerImages.filter((image: unknown): image is string => typeof image === 'string' && image.trim().length > 0)
    : content?.partnerImage
      ? [content.partnerImage]
      : []
  const volunteerBullets = content?.volunteerBullets || [
    "Event Staff & Logistics",
    "Teaching Assistants (Music/Art)",
    "Administrative Support"
  ]
  const partnerBullets = content?.partnerBullets || [
    "School Residencies & Workshops",
    "Corporate Sponsorships",
    "Cross-Promotional Events"
  ]

  return (
    <div className="min-h-screen bg-lime-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-green-600 text-white overflow-hidden rounded-b-[3rem] shadow-xl">

        <div className="absolute inset-0">
          <Image
            src={page?.heroImage || 'https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=2070&auto=format&fit=crop'}
            alt="Get involved"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-lime-600 to-emerald-500 opacity-90" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />
        </div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lime-300/30 rounded-full blur-3xl animate-pulse mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-green-500/20 rounded-full blur-3xl animate-pulse mix-blend-screen delay-700" />
        
        <div className="container relative z-10 text-center max-w-4xl space-y-8">
          <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md shadow-lg animate-fade-in-up">
             <span className="flex h-2 w-2 rounded-full bg-lime-400 mr-2 animate-pulse"></span>
             Join Our Community
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight drop-shadow-sm">
            <DecorativeTitle text={page?.heroTitle || 'Be the Rhythm.'} variant="hero" />
          </h1>
          <p className="text-xl md:text-2xl text-lime-100 font-medium max-w-2xl mx-auto leading-relaxed">
            {page?.heroSubtitle || 'Whether you have time, talent, or resources to share, your contribution helps us keep the beat alive.'}
          </p>
        </div>

        {/* Wave Divider */}
      </section>


      {/* Volunteer Opportunities */}
      <section className="py-24 container relative z-10">
        <div className="flex flex-col md:flex-row gap-16 items-center mb-24">
          <div className="w-full md:w-1/2 relative group">
             <div className="absolute inset-0 bg-gradient-to-br from-lime-400 to-green-500 rounded-[2rem] blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
             <div className="relative aspect-video bg-white rounded-[2rem] overflow-hidden shadow-xl border-4 border-white transform group-hover:scale-[1.02] transition-transform duration-500 flex items-center justify-center bg-lime-50">
                {content?.volunteerImage ? (
                  <Image src={content.volunteerImage} alt={content?.volunteerTitle || 'Volunteer'} fill className="object-cover" />
                ) : (
                  <Users className="h-24 w-24 text-lime-200" />
                )}
             </div>
          </div>
          
          <div className="w-full md:w-1/2 space-y-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-lime-100 text-green-600 shadow-sm transform -rotate-3">
              <Users className="h-8 w-8" />
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-foreground">{content?.volunteerTitle || content?.sections?.[0]?.title || 'Volunteer With Us'}</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {content?.volunteerDescription || content?.sections?.[0]?.description || 'Our events and programs rely on the dedication of volunteers. From setting up stages to checking in guests, your help makes our work possible.'}
            </p>
            <ul className="space-y-4">
              {volunteerBullets.map((item: string) => (
                <li key={item} className="flex items-center gap-3 text-lg font-medium text-foreground/80">
                  <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Button size="lg" asChild className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-green-500 to-lime-600 hover:from-green-600 hover:to-lime-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <Link href="/contact?subject=volunteer">
                Apply to Volunteer <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Partnerships */}
        <div className="flex flex-col md:flex-row-reverse gap-16 items-center">
          <div className="w-full md:w-1/2 relative group">
             <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-lime-500 rounded-[2rem] blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
             <div className="relative aspect-video bg-white rounded-[2rem] overflow-hidden shadow-xl border-4 border-white transform group-hover:scale-[1.02] transition-transform duration-500 flex items-center justify-center bg-green-50 p-3 md:p-4">
                {partnerImages.length > 0 ? (
                  <div className="grid h-full w-full grid-cols-2 gap-3">
                    {partnerImages.slice(0, 4).map((image: string, index: number) => (
                      <div
                        key={`${image}-${index}`}
                        className={[
                          'relative overflow-hidden rounded-[1.25rem] bg-lime-100 shadow-md',
                          partnerImages.length === 1 ? 'col-span-2' : '',
                          partnerImages.length === 3 && index === 0 ? 'row-span-2' : '',
                        ].filter(Boolean).join(' ')}
                      >
                        <Image
                          src={image}
                          alt={`${content?.partnerTitle || 'Partner'} ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <Briefcase className="h-24 w-24 text-green-200" />
                )}
             </div>
          </div>
          
          <div className="w-full md:w-1/2 space-y-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-green-100 text-green-600 shadow-sm transform rotate-3">
              <Briefcase className="h-8 w-8" />
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-foreground">{content?.partnerTitle || content?.sections?.[2]?.title || 'Partner With Us'}</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {content?.partnerDescription || content?.sections?.[2]?.description || 'We collaborate with schools, businesses, and other nonprofits to expand our reach. Let\'s create something impactful together.'}
            </p>
            <ul className="space-y-4">
              {partnerBullets.map((item: string) => (
                <li key={item} className="flex items-center gap-3 text-lg font-medium text-foreground/80">
                  <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Button variant="outline" size="lg" asChild className="h-14 px-8 text-lg rounded-full border-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all hover:-translate-y-1">
              <Link href="/contact?subject=partnership">
                Become a Partner <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Donate CTA */}
      <section className="py-24 bg-white relative overflow-hidden mt-12">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-lime-500 to-green-600" />
        <div className="container max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-lime-50 mb-8 animate-bounce-slow">
            <Heart className="h-10 w-10 text-green-500 fill-current" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-foreground">
            <DecorativeTitle text={content?.donateHeadline || 'Make a Financial Contribution'} />
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            {content?.donateDescription || 'Can\'t volunteer? Your donation is the most direct way to support our mission. Every dollar goes towards instruments, education, and community events.'}
          </p>
          <Button size="lg" asChild className="h-16 px-12 text-xl font-bold rounded-full bg-gradient-to-r from-green-500 to-lime-600 hover:from-green-600 hover:to-lime-700 shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
            <Link href="/donate">{content?.donateButtonLabel || 'Donate Now'}</Link>
          </Button>
        </div>
        
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-lime-100 rounded-full blur-3xl opacity-50 translate-x-1/3 translate-y-1/3" />
      </section>

      {/* Newsletter Signup */}
      <section className="py-24 container">
        <div className="bg-gradient-to-br from-green-900 to-lime-900 text-white rounded-[2.5rem] p-8 lg:p-16 text-center max-w-5xl mx-auto relative overflow-hidden shadow-2xl">
           {/* Background Pattern */}
           <div className="absolute inset-0 bg-[url('/pattern-grid.svg')] opacity-10 mix-blend-overlay" />
           <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500/30 rounded-full blur-3xl animate-pulse" />
           <div className="absolute bottom-0 left-0 w-72 h-72 bg-green-500/30 rounded-full blur-3xl animate-pulse delay-700" />
           
           <div className="relative z-10">
             <Mail className="h-16 w-16 mx-auto mb-6 text-lime-300" />
             <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6"><DecorativeTitle text={content?.newsletterHeadline || 'Stay in the Loop'} /></h2>
             <p className="text-xl text-lime-100 mb-10 max-w-2xl mx-auto font-medium">
               {content?.newsletterDescription || 'Sign up for our newsletter to receive updates on upcoming events, program success stories, and volunteer opportunities.'}
             </p>
             <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
               <Input 
                 type="email" 
                 placeholder="Enter your email" 
                 className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-14 rounded-xl backdrop-blur-sm focus-visible:ring-lime-400"
                 required
               />
               <Button variant="secondary" size="lg" className="h-14 px-8 font-bold text-lg rounded-xl bg-white text-green-900 hover:bg-green-50 hover:scale-105 transition-transform shadow-lg">
                 Subscribe
               </Button>
             </form>
             <p className="text-sm text-lime-300/80 mt-6 font-medium">
               {content?.newsletterPrivacyText || 'We respect your privacy. Unsubscribe at any time.'}
             </p>
           </div>
        </div>
      </section>
    </div>
  )
}
