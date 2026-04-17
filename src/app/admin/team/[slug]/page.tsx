import { notFound } from 'next/navigation'
import TeamForm from '@/components/admin/TeamForm'
import { getTeam } from '@/lib/api'
import { TeamMember } from '@/lib/types'
import { requireAdminPagePermission } from '@/lib/admin-auth'

export async function generateStaticParams() {
  const team = await getTeam()
  return team.map((member: TeamMember) => ({
    slug: member.slug,
  }))
}

export default async function EditTeamMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdminPagePermission('team')
  const { slug } = await params
  const team = await getTeam()
  const member = team.find((m: TeamMember) => m.slug === slug)

  if (!member) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Edit Team Member</h1>
        <p className="text-slate-500 mt-2">Update member details.</p>
      </div>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <TeamForm initialData={member} />
      </div>
    </div>
  )
}
