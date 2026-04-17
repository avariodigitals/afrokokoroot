import TeamForm from '@/components/admin/TeamForm'
import { requireAdminPagePermission } from '@/lib/admin-auth'

export default async function NewTeamMemberPage() {
  await requireAdminPagePermission('team')

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Add New Team Member</h1>
        <p className="text-slate-500 mt-2">Add a new member to your organization.</p>
      </div>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <TeamForm />
      </div>
    </div>
  )
}
