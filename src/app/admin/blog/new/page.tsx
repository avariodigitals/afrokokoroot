import BlogForm from '@/components/admin/BlogForm'
import { requireAdminPagePermission } from '@/lib/admin-auth'

export default async function NewBlogPage() {
  await requireAdminPagePermission('blog')

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Create New Blog Post</h1>
        <p className="text-slate-500 mt-2">Share your thoughts with the world.</p>
      </div>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <BlogForm />
      </div>
    </div>
  )
}
