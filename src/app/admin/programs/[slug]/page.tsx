import { notFound } from 'next/navigation'
import ProgramForm from '@/components/admin/ProgramForm'
import { getPrograms } from '@/lib/api'
import { Program } from '@/lib/types'
import { requireAdminPagePermission } from '@/lib/admin-auth'

export async function generateStaticParams() {
  const programs = await getPrograms()
  return programs.map((program: Program) => ({
    slug: program.slug,
  }))
}

export default async function EditProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdminPagePermission('programs')
  const { slug } = await params
  const programs = await getPrograms()
  const program = programs.find((p: Program) => p.slug === slug)

  if (!program) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Edit Program</h1>
        <p className="text-slate-500 mt-2">Update program details.</p>
      </div>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <ProgramForm initialData={program} />
      </div>
    </div>
  )
}
