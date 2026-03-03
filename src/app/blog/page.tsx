import Image from "next/image"
import Link from "next/link"
import { Metadata } from "next"
import { Calendar, User, ArrowRight, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getBlogPosts } from "@/lib/api"
import { BlogPost } from "@/lib/types"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Blog",
  description: "Read our latest news, stories, and insights on African culture, arts, and community empowerment.",
  openGraph: {
    title: "Blog | Afrokokoroot Foundation",
    description: "Read our latest news, stories, and insights on African culture, arts, and community empowerment.",
    url: `${siteConfig.url}/blog`,
  },
}

export default async function BlogPage() {
  const blogPosts = await getBlogPosts()

  return (
    <div className="min-h-screen bg-lime-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-green-900 text-white overflow-hidden rounded-b-[3rem] shadow-xl">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1461301214746-1e790926d323?q=80&w=2070&auto=format&fit=crop"
            alt="Art and cultural stories"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-lime-900/80 to-emerald-900/80" />
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />
        </div>
        
        {/* Animated Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500/20 rounded-full blur-3xl animate-pulse mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-500/20 rounded-full blur-3xl animate-pulse mix-blend-screen delay-1000" />

        <div className="container relative z-10 text-center max-w-4xl space-y-6">
          <div className="inline-flex items-center rounded-full border border-lime-300/30 bg-lime-400/10 px-4 py-1.5 text-sm font-medium text-lime-200 backdrop-blur-md shadow-lg">
             <span className="flex h-2 w-2 rounded-full bg-lime-400 mr-2 animate-pulse"></span>
             Insights & Stories
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight drop-shadow-lg">
            Rhythm & <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-green-300">Resonance</span>
          </h1>
          <p className="text-xl md:text-2xl text-lime-100 font-medium max-w-2xl mx-auto leading-relaxed">
            Explore the latest news, artist spotlights, and thought leadership on the power of African arts and culture.
          </p>
        </div>
      </section>

      {/* Blog Listing */}
      <section className="py-24 container relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post: BlogPost) => (
            <div key={post.slug} className="group flex flex-col bg-white border border-lime-100 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-green-900/10 transition-all duration-300 hover:-translate-y-2 h-full">
              <div className="aspect-video bg-lime-100 relative overflow-hidden">
                 {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                 ) : (
                    <>
                       <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-lime-500/10 mix-blend-multiply" />
                       <div className="absolute inset-0 flex items-center justify-center text-green-900/20 font-bold bg-white/50 backdrop-blur-[2px] group-hover:scale-105 transition-transform duration-700">
                         [Image: {post.title}]
                       </div>
                    </>
                 )}
                 
                 {/* Category Badge */}
                 <div className="absolute top-4 left-4">
                   <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/90 text-green-600 shadow-sm backdrop-blur-md">
                     <Tag className="h-3 w-3 mr-1.5 text-lime-600" />
                     {post.category}
                   </span>
                 </div>
              </div>
              
              <div className="flex-1 p-8 flex flex-col">
                <div className="flex items-center gap-4 text-xs font-semibold text-green-500 mb-4 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {post.date}
                  </div>
                  <div className="w-1 h-1 rounded-full bg-lime-300" />
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    {post.author}
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold mb-4 text-green-900 group-hover:text-lime-600 transition-colors line-clamp-2 leading-tight">
                  <Link href={`/blog/${post.slug}`} className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {post.title}
                  </Link>
                </h2>
                
                <p className="text-muted-foreground leading-relaxed mb-6 flex-1 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="mt-auto pt-6 border-t border-lime-100 flex items-center justify-between">
                   <span className="text-sm font-bold text-lime-600 group-hover:translate-x-1 transition-transform flex items-center">
                     Read Article <ArrowRight className="ml-2 h-4 w-4" />
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination / Load More (Placeholder) */}
        <div className="mt-16 text-center">
          <Button variant="outline" size="lg" className="rounded-full px-8 border-2 border-green-100 text-green-600 hover:bg-lime-50 hover:border-green-200 hover:text-green-700 transition-all">
            Load More Stories
          </Button>
        </div>
      </section>
    </div>
  )
}
