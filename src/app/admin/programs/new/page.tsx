import ProgramForm from '@/components/admin/ProgramForm'
import { requireAdminPagePermission } from '@/lib/admin-auth'

export default async function NewProgramPage() {
  await requireAdminPagePermission('programs')

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Create New Program</h1>
        <p className="text-slate-500 mt-2">Add a new educational or community program.</p>
      </div>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <ProgramForm />
      </div>
    </div>
  )
}
