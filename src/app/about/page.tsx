import Image from "next/image"
import { Metadata } from "next"
import { ShieldCheck, Heart, Users, FileText, Globe, BookOpen, Scale, Leaf, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import DecorativeTitle from "@/components/ui/DecorativeTitle"
import { siteConfig } from "@/lib/site-config"
import { getPageContent, getPublicSiteUrl, getTeam } from "@/lib/api"
import type { PageContent, TeamMember } from "@/lib/types"

export async function generateMetadata(): Promise<Metadata> {
  const publicSiteUrl = await getPublicSiteUrl()

  return {
    title: "About Us",
    description: "Learn about the Afrokokoroot Foundation's mission, governance, and commitment to preserving African heritage and empowering communities.",
    openGraph: {
      title: "About Us | Afrokokoroot Foundation",
      description: "Learn about the Afrokokoroot Foundation's mission, governance, and commitment to preserving African heritage and empowering communities.",
      url: `${publicSiteUrl}/about`,
    },
  }
}

export default async function AboutPage() {
  const boardMembers = await getTeam()
  const page = await getPageContent('about')
  const pageContent = page?.content || {}
  const boardRows: TeamMember[][] = []

  for (let i = 0; i < boardMembers.length; i += 3) {
    boardRows.push(boardMembers.slice(i, i + 3))
  }

  const heroTitle = page?.heroTitle || pageContent.heroTitle || 'Preserving Heritage, Inspiring Unity'
  const heroSubtitle = page?.heroSubtitle || pageContent.heroSubtitle || 'The Afrokokoroot Foundation is a 501(c)(3) public charity dedicated to cultural education, wellness, and community empowerment through the universal language of community and nature.'
  const heroImage = page?.heroImage || pageContent.heroImage || 'https://images.unsplash.com/photo-1504194921103-f8b80cadd5e4?q=80&w=2070&auto=format&fit=crop'
  const missionIntro = pageContent.missionIntro || 'Afrokokoroot Foundation is structured as a 501(c)(3) public charity. We are legally and operationally separate from commercial entities. Our mission is purely charitable and educational, focused on serving underserved communities.'
  const governanceText = pageContent.governanceText || 'We maintain strict compliance and credibility through a diverse Board of Directors with a majority of independent members. Our governance includes robust policies for conflict of interest, financial oversight, and transparency.'
  const pillarItems = pageContent.pillarItems || [
    { icon: 'book', title: 'Cultural Education', description: 'Arts, storytelling, and cultural expression.' },
    { icon: 'leaf', title: 'Wellness & Nature', description: 'Outdoor recreation and land-based learning.' },
    { icon: 'heart', title: 'Food Security', description: 'Sustainable agriculture and nutrition.' },
    { icon: 'users', title: 'Community Peace', description: 'Cross-cultural engagement and unity.' }
  ]
  const leadershipHeadline = pageContent.leadershipHeadline || 'Board of Directors'
  const leadershipCopy = pageContent.leadershipCopy || 'Our independent board ensures we stay true to our mission and serve the public interest.'
  const transparencyHeadline = pageContent.transparencyHeadline || 'Financial Transparency'
  const transparencyCopy = pageContent.transparencyCopy || 'We are committed to open and honest financial reporting. Our funds are used strictly for charitable purposes, with clear separation from any commercial activities.'

  const iconMap: Record<string, any> = {
    book: BookOpen,
    leaf: Leaf,
    heart: Heart,
    users: Users
  }

  return (
    <div className="min-h-screen bg-lime-50 font-sans selection:bg-lime-200 selection:text-green-900">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-green-900 text-white overflow-hidden rounded-b-[3rem] shadow-xl">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="Community gathering and celebration"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-950/90 via-green-900/80 to-lime-900/80" />
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />
        </div>
        
        {/* Animated Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lime-500/30 rounded-full blur-3xl animate-pulse mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-green-500/30 rounded-full blur-3xl animate-pulse mix-blend-screen delay-1000" />

        <div className="container relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-lg">
            <DecorativeTitle text={heroTitle} variant="hero" />
          </h1>
          <p className="text-xl md:text-2xl text-lime-50 max-w-3xl mx-auto font-light leading-relaxed">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Legal Status & Mission */}
      <section className="py-24 container relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-lime-100/50 to-transparent -z-10" />
        
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 text-green-700 font-bold mb-2">
                <ShieldCheck className="h-5 w-5" /> Official Status
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-green-950">A Public Charity for Public Good</h2>
              <p className="text-lg text-slate-700 leading-relaxed">
                {missionIntro}
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Charitable & Educational Purpose",
                  "Public Benefit Focus",
                  "No Private Inurement",
                  "Community-Centered Programs"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="h-5 w-5 text-lime-600 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-lime-100">
              <h3 className="text-xl font-bold mb-4 text-green-900 flex items-center gap-2">
                <Scale className="h-5 w-5 text-lime-600" />
                Our Governance
              </h3>
              <p className="text-slate-600 mb-4">
                {governanceText}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-xl border border-lime-200 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-lime-100/50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
              
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-green-900">
                <Globe className="h-8 w-8 text-lime-600" />
                Our Core Pillars
              </h3>
              <p className="text-slate-600 mb-8 text-lg">
                We empower youth and families through four integrated pathways:
              </p>
              <ul className="space-y-4">
                {pillarItems.map((item: any) => {
                  const Icon = iconMap[item.icon] || CheckCircle2
                  return (
                    <li key={item.title} className="flex items-start gap-4 p-4 rounded-xl bg-lime-50 hover:bg-lime-100 transition-colors">
                      <div className="bg-white p-2 rounded-lg shadow-sm text-green-600 mt-1">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-bold text-green-900 block">{item.title}</span>
                        <span className="text-sm text-slate-600">{item.description}</span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership / Board */}
      <section className="py-24 bg-white relative overflow-hidden rounded-3xl mx-4 shadow-sm border border-lime-100">
        <div className="container relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-lime-100 text-green-800 font-bold text-sm mb-4">Leadership</span>
          <h2 className="text-4xl font-bold tracking-tight mb-4 text-green-950"><DecorativeTitle text={leadershipHeadline} /></h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-16">
            {leadershipCopy}
          </p>
          
          <div className="space-y-10 max-w-7xl mx-auto">
            {boardRows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className={`grid gap-10 ${row.length === 1 ? 'grid-cols-1 justify-items-center' : row.length === 2 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 justify-items-center' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}
              >
                {row.map((member) => (
                  <div key={member.name} className="group flex flex-col items-center text-center space-y-6 p-6 rounded-3xl hover:bg-lime-50 transition-all duration-300">
                    <div className="h-48 w-48 rounded-full bg-gradient-to-br from-[#E9A907] to-lime-500 p-1 shadow-lg group-hover:scale-105 transition-transform duration-300">
                      <div className="w-full h-full rounded-full bg-white overflow-hidden relative border-4 border-white flex items-center justify-center">
                        {member.image ? (
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-4xl font-black text-green-900 tracking-tighter">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold text-green-900">{member.name}</h3>
                      <p className="text-lime-600 font-bold uppercase tracking-wider text-sm">{member.role}</p>
                    </div>
                    
                    <p className="text-slate-600 leading-relaxed text-sm">
                      {member.bio}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Financials / Transparency */}
      <section className="py-24 bg-green-900 text-white relative overflow-hidden mt-24">
        <div className="absolute inset-0 bg-[url('/pattern-grid.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-green-950 to-green-800 opacity-90" />
        
        <div className="container relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8"><DecorativeTitle text={transparencyHeadline} /></h2>
          <p className="text-xl text-lime-100 max-w-3xl mx-auto mb-12">
            {transparencyCopy}
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
             <Button variant="outline" className="h-auto py-6 flex flex-col gap-2 items-center justify-center bg-white/5 border-white/20 hover:bg-white/10 hover:text-white group text-white">
               <FileText className="h-8 w-8 mb-1 group-hover:scale-110 transition-transform text-lime-400" />
               <span className="font-bold text-lg">IRS Determination Letter</span>
               <span className="text-xs text-lime-200/60 font-normal">View 501(c)(3) Status</span>
             </Button>
             
             <Button variant="outline" className="h-auto py-6 flex flex-col gap-2 items-center justify-center bg-white/5 border-white/20 hover:bg-white/10 hover:text-white group text-white">
               <ShieldCheck className="h-8 w-8 mb-1 group-hover:scale-110 transition-transform text-green-400" />
               <span className="font-bold text-lg">Annual Impact Report</span>
               <span className="text-xs text-lime-200/60 font-normal">Coming Soon</span>
             </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
