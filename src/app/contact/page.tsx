import Image from "next/image"
import Link from "next/link"
import { Metadata } from "next"
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { getContactInfo } from "@/lib/api"
import { siteConfig } from "@/lib/site-config"
import { ThreadsIcon } from "@/components/icons"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Afrokokoroot Foundation. We'd love to hear from you.",
  openGraph: {
    title: "Contact Us | Afrokokoroot Foundation",
    description: "Get in touch with the Afrokokoroot Foundation. We'd love to hear from you.",
    url: `${siteConfig.url}/contact`,
  },
}

export default async function ContactPage() {
  const contactInfo = await getContactInfo()
  return (
    <div className="min-h-screen bg-lime-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-green-900 text-white overflow-hidden rounded-b-[3rem] shadow-xl">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop"
            alt="Contact our team"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-lime-900/80 to-emerald-900/80" />
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />
        </div>
        
        {/* Animated Blobs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-lime-500/30 rounded-full blur-3xl animate-pulse mix-blend-screen" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-green-500/30 rounded-full blur-3xl animate-pulse mix-blend-screen delay-1000" />

        <div className="container relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-lg">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-green-300">Touch</span>
          </h1>
          <p className="text-xl md:text-2xl text-lime-100 max-w-3xl mx-auto font-light leading-relaxed">
            We&apos;d love to hear from you. Whether you have a question, want to partner, or just want to say hello.
          </p>
        </div>
      </section>

      <div className="container py-12 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold mb-8 text-green-900">Contact Information</h2>
              <div className="space-y-8">
                <div className="group flex items-start gap-6 p-6 rounded-2xl bg-white shadow-sm border border-lime-100 hover:shadow-md transition-all hover:-translate-y-1">
                  <div className="bg-lime-100 p-4 rounded-xl text-lime-600 group-hover:bg-lime-600 group-hover:text-white transition-colors">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-gray-900">Email Us</h3>
                    <p className="text-muted-foreground mb-2">For general inquiries and partnerships</p>
                    <a href={`mailto:${contactInfo.email}`} className="text-green-600 hover:text-green-800 font-bold text-lg transition-colors">
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                <div className="group flex items-start gap-6 p-6 rounded-2xl bg-white shadow-sm border border-lime-100 hover:shadow-md transition-all hover:-translate-y-1">
                  <div className="bg-green-100 p-4 rounded-xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-gray-900">Call Us</h3>
                    <p className="text-muted-foreground mb-2">Mon-Fri from 9am to 5pm CST</p>
                    <a href={`tel:${contactInfo.phone}`} className="text-green-600 hover:text-green-800 font-bold text-lg transition-colors">
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="group flex items-start gap-6 p-6 rounded-2xl bg-white shadow-sm border border-lime-100 hover:shadow-md transition-all hover:-translate-y-1">
                  <div className="bg-emerald-100 p-4 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-gray-900">Visit Us</h3>
                    <p className="text-muted-foreground mb-2 text-lg">
                      {contactInfo.address}
                    </p>
                    <p className="text-sm text-muted-foreground italic bg-gray-100 inline-block px-2 py-1 rounded-md">
                      *By appointment only
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6 text-green-900">Connect on Social Media</h2>
              <div className="flex gap-4">
                {contactInfo.socials.facebook && (
                  <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-2 border-green-200 hover:border-green-600 hover:bg-green-600 hover:text-white transition-all" asChild>
                    <Link href={contactInfo.socials.facebook} target="_blank">
                      <Facebook className="h-5 w-5" />
                      <span className="sr-only">Facebook</span>
                    </Link>
                  </Button>
                )}
                {contactInfo.socials.instagram && (
                  <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-2 border-lime-200 hover:border-lime-600 hover:bg-lime-600 hover:text-white transition-all" asChild>
                    <Link href={contactInfo.socials.instagram} target="_blank">
                      <Instagram className="h-5 w-5" />
                      <span className="sr-only">Instagram</span>
                    </Link>
                  </Button>
                )}
                {contactInfo.socials.threads && (
                  <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-2 border-slate-200 hover:border-black hover:bg-black hover:text-white transition-all" asChild>
                    <Link href={contactInfo.socials.threads} target="_blank">
                      <ThreadsIcon className="h-5 w-5" />
                      <span className="sr-only">Threads</span>
                    </Link>
                  </Button>
                )}
                {contactInfo.socials.twitter && (
                  <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-2 border-emerald-200 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white transition-all" asChild>
                    <Link href={contactInfo.socials.twitter} target="_blank">
                      <Twitter className="h-5 w-5" />
                      <span className="sr-only">Twitter</span>
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border border-lime-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-lime-100 rounded-bl-full -mr-8 -mt-8 opacity-50" />
            
            <h2 className="text-3xl font-bold mb-8 text-green-900 relative z-10">Send a Message</h2>
            <form className="space-y-6 relative z-10">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</label>
                  <Input id="firstName" placeholder="John" className="h-12 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</label>
                  <Input id="lastName" placeholder="Doe" className="h-12 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                <Input id="email" type="email" placeholder="john@example.com" className="h-12 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject</label>
                <Input id="subject" placeholder="How can we help?" className="h-12 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
                <Textarea id="message" placeholder="Tell us more..." className="min-h-[150px] rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500 resize-none" />
              </div>
              
              <Button size="lg" className="w-full h-14 rounded-xl text-lg font-bold bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700 shadow-lg hover:shadow-xl transition-all">
                Send Message <Send className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Wave Divider to Footer (Dark Indigo) */}

    </div>
  )
}
