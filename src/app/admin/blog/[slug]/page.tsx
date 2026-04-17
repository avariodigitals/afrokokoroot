import { notFound } from 'next/navigation'
import BlogForm from '@/components/admin/BlogForm'
import { getBlogPosts } from '@/lib/api'
import { BlogPost } from '@/lib/types'
import { requireAdminPagePermission } from '@/lib/admin-auth'

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post: BlogPost) => ({
    slug: post.slug,
  }))
}

export default async function EditBlogPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdminPagePermission('blog')
  const { slug } = await params
  const posts = await getBlogPosts()
  const post = posts.find((p: BlogPost) => p.slug === slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Edit Blog Post</h1>
        <p className="text-slate-500 mt-2">Update &quot;{post.title}&quot;.</p>
      </div>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <BlogForm initialData={post} />
      </div>
    </div>
  )
}
