import { notFound } from 'next/navigation'
import { getPageContent, getPages } from '@/lib/api'
import PageForm from '@/components/admin/PageForm'
import { PageContent } from '@/lib/types'

export async function generateStaticParams() {
  const pages: PageContent[] = await getPages()
  return pages.map((page) => ({ slug: page.slug }))
}

export default async function PageContentEditor({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getPageContent(slug)

  if (!page) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-green-900">Edit {page.title}</h1>
          <p className="text-sm text-green-700 mt-2">Update text, hero assets and advanced JSON content for this page.</p>
        </div>
      </div>
      <PageForm initialData={page} />
    </div>
  )
}
