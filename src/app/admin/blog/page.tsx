import Link from "next/link"
import { getBlogPosts } from "@/lib/api"
import { Plus, Pencil, Trash2, Calendar, User } from "lucide-react"
import { deleteBlogPost } from "@/lib/actions"
import { BlogPost } from "@/lib/types"
import { requireAdminPagePermission } from "@/lib/admin-auth"

export default async function AdminBlogPage() {
  await requireAdminPagePermission('blog')
  const posts = await getBlogPosts()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Blog Posts</h1>
          <p className="text-slate-500 mt-1">Manage your news and articles</p>
        </div>
        <Link 
          href="/admin/blog/new" 
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium w-full sm:w-auto justify-center"
        >
          <Plus className="h-4 w-4" />
          Add Post
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Title</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Author & Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Category</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
          <tbody className="divide-y divide-slate-100">
            {posts.map((post: BlogPost) => (
              <tr key={post.slug} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{post.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{post.excerpt}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <User className="h-4 w-4 text-slate-400" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-xs mt-1">
                    <Calendar className="h-3 w-3" />
                    <span>{post.date}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {post.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link 
                      href={`/admin/blog/${post.slug}`}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit Post"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <form action={async () => {
                      'use server'
                      await deleteBlogPost(post.slug)
                    }}>
                      <button 
                        type="submit"
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Post"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  No blog posts found. Click &quot;Add Post&quot; to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  )
}
