import Link from "next/link"
import { getTeam } from "@/lib/api"
import { TeamMember } from "@/lib/types"
import { Plus, Pencil, Trash2, Users } from "lucide-react"
import { deleteTeamMember } from "@/lib/actions"
import { requireAdminPagePermission } from "@/lib/admin-auth"

export default async function TeamAdminPage() {
  await requireAdminPagePermission('team')
  const team = await getTeam()

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Team</h1>
          <p className="text-slate-500 mt-2">Manage your team members and leadership.</p>
        </div>
        <Link href="/admin/team/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium shadow-sm w-full sm:w-auto justify-center">
          <Plus className="h-4 w-4" />
          Add New Member
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 font-semibold text-slate-700 w-[300px]">Name</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Role</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {team.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="h-8 w-8 text-slate-300" />
                      <p>No team members found. Add your first member!</p>
                    </div>
                  </td>
                </tr>
              ) : (
                team.map((member: TeamMember) => (
                  <tr key={member.slug || member.name} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 group-hover:text-indigo-700 transition-colors">
                        {member.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {member.role}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/team/${member.slug}`}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <form action={async () => {
                          'use server'
                          await deleteTeamMember(member.slug)
                        }}>
                          <button 
                            type="submit"
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
