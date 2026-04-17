import Link from 'next/link'
import { getPages } from '@/lib/api'
import { PageContent } from '@/lib/types'

export default async function AdminPages() {
  const pages: PageContent[] = await getPages()

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-green-900">Page Content</h1>
          <p className="text-sm text-green-700 mt-2">Edit the page text, hero image, and structured content for your site pages.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {pages.map((page) => (
          <div key={page.slug} className="bg-white p-6 rounded-3xl shadow-sm border border-lime-100">
            <h2 className="text-xl font-semibold text-green-900 mb-2">{page.title}</h2>
            <p className="text-sm text-slate-600 mb-6">Slug: <span className="font-mono">{page.slug}</span></p>
            <Link href={`/admin/pages/${page.slug}`} className="inline-flex items-center justify-center px-4 py-3 rounded-xl bg-green-900 text-white text-sm font-medium hover:bg-green-800 transition">
              Edit this page
            </Link>
          </div>
        ))}
        {pages.length === 0 && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-lime-100 text-slate-600">
            No editable pages have been configured yet.
          </div>
        )}
      </div>
    </div>
  )
}
