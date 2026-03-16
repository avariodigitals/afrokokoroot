import Image from "next/image"
import { Metadata } from "next"
import { ShieldCheck, Heart, Users, FileText, Globe, BookOpen, Scale, Leaf, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about the Afrokokoroot Foundation's mission, governance, and commitment to preserving African heritage and empowering communities.",
  openGraph: {
    title: "About Us | Afrokokoroot Foundation",
    description: "Learn about the Afrokokoroot Foundation's mission, governance, and commitment to preserving African heritage and empowering communities.",
    url: `${siteConfig.url}/about`,
  },
}

export default async function AboutPage() {
  const boardMembers = [
    {
      name: "Sunny Dada",
      role: "Founder and Director",
      image: "https://ik.imagekit.io/360t0n1jd9/Afrokoko%20Foundation%20Assets/Sunny%20Dada%20-%20Founder%20and%20Director.jpeg",
      bio: "Dedicated leader committed to preserving African heritage and fostering community unity through music and education."
    },
    {
      name: "Chujuana Harris",
      role: "Secretary",
      image: "https://ik.imagekit.io/360t0n1jd9/Afrokoko%20Foundation%20Assets/Chujuana%20Harris%20-%20Secreatary.jpeg",
      bio: "Organized and passionate professional ensuring smooth operations and clear communication within the foundation."
    },
    {
      name: "Terry Hardin",
      role: "Director",
      image: "https://ik.imagekit.io/360t0n1jd9/Afrokoko%20Foundation%20Assets/Terry%20Hardin%20-%20Director.jpeg",
      bio: "Strategic director focused on expanding the reach and impact of the Afrokokoroot Foundation."
    },
    {
      name: "Nelson Guillen",
      role: "Member",
      image: "https://ik.imagekit.io/360t0n1jd9/Afrokoko%20Foundation%20Assets/Nelson%20Guillen%20-%20Member.jpeg",
      bio: "Active community member providing valuable insights and support to the foundation's initiatives."
    }
  ]

  return (
    <div className="min-h-screen bg-lime-50 font-sans selection:bg-lime-200 selection:text-green-900">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-green-900 text-white overflow-hidden rounded-b-[3rem] shadow-xl">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1504194921103-f8b80cadd5e4?q=80&w=2070&auto=format&fit=crop"
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
            Preserving Heritage, <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-green-300">Inspiring Unity</span>
          </h1>
          <p className="text-xl md:text-2xl text-lime-50 max-w-3xl mx-auto font-light leading-relaxed">
            The Afrokokoroot Foundation is a 501(c)(3) public charity dedicated to cultural education, wellness, and community empowerment through the universal language of community and nature.
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
                Afrokokoroot Foundation is structured as a <strong>501(c)(3) public charity</strong>. We are legally and operationally separate from any commercial entities. Our mission is purely charitable and educational, focused on serving underserved communities.
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
                We maintain strict compliance and credibility through a diverse <strong>Board of Directors</strong>, with a majority of independent members. Our governance includes robust policies for conflict of interest, financial oversight, and transparency.
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
                <li className="flex items-start gap-4 p-4 rounded-xl bg-lime-50 hover:bg-lime-100 transition-colors">
                  <div className="bg-white p-2 rounded-lg shadow-sm text-green-600 mt-1">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-bold text-green-900 block">Cultural Education</span>
                    <span className="text-sm text-slate-600">Arts, storytelling, and cultural expression.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
                  <div className="bg-white p-2 rounded-lg shadow-sm text-green-600 mt-1">
                    <Leaf className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-bold text-green-900 block">Wellness & Nature</span>
                    <span className="text-sm text-slate-600">Outdoor recreation and land-based learning.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4 p-4 rounded-xl bg-lime-50 hover:bg-lime-100 transition-colors">
                  <div className="bg-white p-2 rounded-lg shadow-sm text-green-600 mt-1">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-bold text-green-900 block">Food Security</span>
                    <span className="text-sm text-slate-600">Sustainable agriculture and nutrition.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
                  <div className="bg-white p-2 rounded-lg shadow-sm text-green-600 mt-1">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-bold text-green-900 block">Community Peace</span>
                    <span className="text-sm text-slate-600">Cross-cultural engagement and unity.</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership / Board */}
      <section className="py-24 bg-white relative overflow-hidden rounded-3xl mx-4 shadow-sm border border-lime-100">
        <div className="container relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-lime-100 text-green-800 font-bold text-sm mb-4">Leadership</span>
          <h2 className="text-4xl font-bold tracking-tight mb-4 text-green-950">Board of Directors</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-16">
            Our independent board ensures we stay true to our mission and serve the public interest.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
            {boardMembers.map((member) => (
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
        </div>
      </section>
      
      {/* Financials / Transparency */}
      <section className="py-24 bg-green-900 text-white relative overflow-hidden mt-24">
        <div className="absolute inset-0 bg-[url('/pattern-grid.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-green-950 to-green-800 opacity-90" />
        
        <div className="container relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">Financial Transparency</h2>
          <p className="text-xl text-lime-100 max-w-3xl mx-auto mb-12">
            We are committed to open and honest financial reporting. Our funds are used strictly for charitable purposes, with clear separation from any commercial activities.
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
