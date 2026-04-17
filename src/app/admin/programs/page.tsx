import Link from "next/link"
import { getPrograms } from "@/lib/api"
import { Plus, Pencil, Trash2, Music } from "lucide-react"
import { deleteProgram } from "@/lib/actions"
import { Program } from "@/lib/types"
import { requireAdminPagePermission } from "@/lib/admin-auth"

export default async function ProgramsAdminPage() {
  await requireAdminPagePermission('programs')
  const programs = await getPrograms()

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Programs</h1>
          <p className="text-slate-500 mt-2">Manage your educational and community programs.</p>
        </div>
        <Link href="/admin/programs/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium shadow-sm w-full sm:w-auto justify-center">
          <Plus className="h-4 w-4" />
          Add New Program
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 font-semibold text-slate-700 w-[400px]">Program Title</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Slug</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {programs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Music className="h-8 w-8 text-slate-300" />
                      <p>No programs found. Create your first one!</p>
                    </div>
                  </td>
                </tr>
              ) : (
                programs.map((program: Program) => (
                  <tr key={program.slug} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 group-hover:text-indigo-700 transition-colors">
                        {program.title}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 line-clamp-1">
                        {program.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        {program.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/programs/${program.slug}`}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <form action={async () => {
                          'use server'
                          await deleteProgram(program.slug)
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
