import Image from "next/image"
import Link from "next/link"
import { Metadata } from "next"
import { Scale, FileText, CheckCircle, AlertTriangle, ShieldCheck, Mail, Phone, MapPin } from "lucide-react"
import { getContactInfo } from "@/lib/api"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Afrokokoroot Foundation. Read our terms and conditions for using our website and services.",
  openGraph: {
    title: "Terms of Service | Afrokokoroot Foundation",
    description: "Terms of Service for Afrokokoroot Foundation. Read our terms and conditions for using our website and services.",
    url: `${siteConfig.url}/terms`,
  },
}

export default async function TermsPage() {
  const contactInfo = await getContactInfo()
  const lastUpdated = "February 25, 2026"

  return (
    <div className="min-h-screen bg-lime-50 font-sans selection:bg-lime-200 selection:text-green-900">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-green-900 text-white overflow-hidden rounded-b-[3rem] shadow-xl">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop"
            alt="Terms and Conditions"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-950/95 via-green-900/90 to-lime-900/90" />
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />
        </div>
        
        {/* Animated Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E9A907]/20 rounded-full blur-3xl animate-pulse mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-green-500/20 rounded-full blur-3xl animate-pulse mix-blend-screen delay-1000" />

        <div className="container relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 text-sm font-medium text-lime-100">
            <Scale className="h-4 w-4 text-[#E9A907]" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-lg">
            Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E9A907] to-lime-300">Service</span>
          </h1>
          <p className="text-xl md:text-2xl text-lime-50 max-w-3xl mx-auto font-light leading-relaxed">
            Please read these terms and conditions carefully before using our website.
          </p>
          <p className="mt-4 text-lime-200/80 text-sm">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container py-16 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Table of Contents / Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-lime-100">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#E9A907]" />
                Table of Contents
              </h3>
              <nav className="space-y-1">
                <a href="#acceptance" className="block px-4 py-2 rounded-lg hover:bg-lime-50 text-slate-600 hover:text-green-700 transition-colors text-sm font-medium">1. Acceptance of Terms</a>
                <a href="#use-license" className="block px-4 py-2 rounded-lg hover:bg-lime-50 text-slate-600 hover:text-green-700 transition-colors text-sm font-medium">2. Use License</a>
                <a href="#disclaimer" className="block px-4 py-2 rounded-lg hover:bg-lime-50 text-slate-600 hover:text-green-700 transition-colors text-sm font-medium">3. Disclaimer</a>
                <a href="#limitations" className="block px-4 py-2 rounded-lg hover:bg-lime-50 text-slate-600 hover:text-green-700 transition-colors text-sm font-medium">4. Limitations</a>
                <a href="#governing-law" className="block px-4 py-2 rounded-lg hover:bg-lime-50 text-slate-600 hover:text-green-700 transition-colors text-sm font-medium">5. Governing Law</a>
                <a href="#contact" className="block px-4 py-2 rounded-lg hover:bg-lime-50 text-slate-600 hover:text-green-700 transition-colors text-sm font-medium">6. Contact Us</a>
              </nav>
            </div>

            <div className="bg-gradient-to-br from-green-900 to-lime-900 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E9A907]/20 rounded-bl-full -mr-8 -mt-8" />
              <h3 className="text-xl font-bold mb-4">Have Questions?</h3>
              <p className="text-lime-100 mb-6 text-sm">
                If you have any questions about our terms, please feel free to contact us.
              </p>
              <Link href="/contact" className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-white text-green-900 font-bold hover:bg-lime-50 transition-colors w-full text-sm">
                Contact Support
              </Link>
            </div>
          </div>

          {/* Terms Content */}
          <div className="lg:col-span-8 space-y-12">
            {/* Acceptance */}
            <section id="acceptance" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-lime-100 text-green-700 rounded-xl">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-green-900">1. Acceptance of Terms</h2>
              </div>
              <div className="prose prose-lg text-muted-foreground max-w-none">
                <p>
                  By accessing this website, accessible from {siteConfig.url}, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site. The materials contained in this Website are protected by copyright and trade mark law.
                </p>
              </div>
            </section>

            {/* Use License */}
            <section id="use-license" className="scroll-mt-24 pt-12 border-t border-lime-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-lime-100 text-green-700 rounded-xl">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-green-900">2. Use License</h2>
              </div>
              <div className="prose prose-lg text-muted-foreground max-w-none">
                <p>
                  Permission is granted to temporarily download one copy of the materials (information or software) on Afrokokoroot Foundation's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>modify or copy the materials;</li>
                  <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                  <li>attempt to decompile or reverse engineer any software contained on Afrokokoroot Foundation's website;</li>
                  <li>remove any copyright or other proprietary notations from the materials; or</li>
                  <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
                </ul>
              </div>
            </section>

            {/* Disclaimer */}
            <section id="disclaimer" className="scroll-mt-24 pt-12 border-t border-lime-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-lime-100 text-green-700 rounded-xl">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-green-900">3. Disclaimer</h2>
              </div>
              <div className="prose prose-lg text-muted-foreground max-w-none">
                <p>
                  The materials on Afrokokoroot Foundation's website are provided on an 'as is' basis. Afrokokoroot Foundation makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </div>
            </section>

            {/* Limitations */}
            <section id="limitations" className="scroll-mt-24 pt-12 border-t border-lime-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-lime-100 text-green-700 rounded-xl">
                  <Scale className="h-6 w-6" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-green-900">4. Limitations</h2>
              </div>
              <div className="prose prose-lg text-muted-foreground max-w-none">
                <p>
                  In no event shall Afrokokoroot Foundation or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Afrokokoroot Foundation's website, even if Afrokokoroot Foundation or a Afrokokoroot Foundation authorized representative has been notified orally or in writing of the possibility of such damage.
                </p>
              </div>
            </section>

            {/* Governing Law */}
            <section id="governing-law" className="scroll-mt-24 pt-12 border-t border-lime-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-lime-100 text-green-700 rounded-xl">
                  <MapPin className="h-6 w-6" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-green-900">5. Governing Law</h2>
              </div>
              <div className="prose prose-lg text-muted-foreground max-w-none">
                <p>
                  These terms and conditions are governed by and construed in accordance with the laws of the United States and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section id="contact" className="scroll-mt-24 pt-12 border-t border-lime-100">
              <div className="bg-lime-50 rounded-3xl p-8 border border-lime-200">
                <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-6">6. Contact Us</h2>
                <p className="text-lg text-slate-600 mb-8">
                  If you have any questions about these Terms, please contact us:
                </p>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-lime-100 group">
                    <div className="p-3 bg-lime-100 text-green-700 rounded-full group-hover:scale-110 transition-transform">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Email Us</p>
                      <p className="font-semibold text-green-900">{contactInfo.email}</p>
                    </div>
                  </a>
                  
                  <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-lime-100 group">
                    <div className="p-3 bg-lime-100 text-green-700 rounded-full group-hover:scale-110 transition-transform">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Call Us</p>
                      <p className="font-semibold text-green-900">{contactInfo.phone}</p>
                    </div>
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
