import { notFound } from "next/navigation"
import Link from "next/link"
import { Metadata } from "next"
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getBlogPosts } from "@/lib/api"
import { siteConfig } from "@/lib/site-config"
import Image from "next/image"

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const posts = await getBlogPosts()
  const post = posts.find((p) => p.slug === slug)

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      url: `${siteConfig.url}/blog/${post.slug}`,
      images: [
        {
          url: post.image || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image || siteConfig.ogImage],
    },
  }
}

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const posts = await getBlogPosts()
  const post = posts.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    image: [post.image || siteConfig.ogImage],
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: siteConfig.ogImage,
      },
    },
    url: `${siteConfig.url}/blog/${post.slug}`,
  }

  return (
    <div className="min-h-screen bg-lime-50/30 font-sans selection:bg-lime-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-green-950">
        {/* Dynamic Background */}
        <div className="absolute inset-0">
            {post.image && (
                <Image 
                    src={post.image} 
                    alt={post.title} 
                    fill 
                    className="object-cover opacity-20 mix-blend-overlay"
                    priority
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-green-950 via-green-900/90 to-black/80" />
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-soft-light"></div>
        </div>

        {/* Animated Blobs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-lime-500/20 rounded-full blur-3xl animate-pulse mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#E9A907]/20 rounded-full blur-3xl animate-pulse delay-1000 mix-blend-screen pointer-events-none" />

        <div className="container relative z-10">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-sm font-bold text-lime-400 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>
          
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
              <span className="bg-[#E9A907] text-black px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-[#E9A907]/20">
                {post.category}
              </span>
              <span className="flex items-center text-lime-100 text-sm font-medium bg-white/5 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10">
                <Calendar className="mr-2 h-4 w-4" />
                {post.date}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-8 drop-shadow-lg leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-center gap-4 text-lg font-medium text-lime-100/90">
              <span className="flex items-center bg-white/5 px-5 py-2.5 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                <User className="mr-2 h-5 w-5 text-[#E9A907]" />
                {post.author}
              </span>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 text-lime-50/30">
          <svg className="w-full h-full fill-current" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      <div className="container py-12 lg:py-20 -mt-20 relative z-20">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-2xl border border-lime-100/50 max-w-4xl mx-auto relative overflow-hidden">
           {/* Decorative corner */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-lime-100/40 to-transparent rounded-bl-full -mr-32 -mt-32 pointer-events-none" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#E9A907]/10 to-transparent rounded-tr-full -ml-32 -mb-32 pointer-events-none" />
          
          <article className="prose prose-lg prose-green mx-auto text-slate-600">
            <p className="lead text-xl md:text-2xl font-medium text-green-900 mb-10 border-l-4 border-[#E9A907] pl-6 italic bg-lime-50/50 py-4 rounded-r-lg">
              {post.excerpt}
            </p>
            
            {post.content ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <div className="space-y-6">
                <p>Content coming soon...</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <h3>Why This Matters</h3>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <ul>
                    <li>Community Engagement</li>
                    <li>Cultural Preservation</li>
                    <li>Youth Empowerment</li>
                </ul>
              </div>
            )}
          </article>
          
          <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6">
             <div className="flex items-center gap-4">
               <span className="text-sm font-bold text-green-800 uppercase tracking-wider">Share this story</span>
               <div className="flex gap-2">
                 <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-green-200 text-green-700 hover:bg-green-50 hover:text-green-900 transition-colors">
                   <Share2 className="h-4 w-4" />
                 </Button>
               </div>
             </div>
             <Button variant="default" asChild className="rounded-full px-8 bg-green-700 hover:bg-green-800 text-white shadow-lg shadow-green-900/20">
               <Link href="/blog">Read More Stories</Link>
             </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
