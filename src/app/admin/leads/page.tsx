import { getLeads } from "@/lib/api"
import { LeadsClientPage } from "./client-page"
import { requireAdminPagePermission } from "@/lib/admin-auth"

export const dynamic = 'force-dynamic'

export default async function AdminLeadsPage() {
  await requireAdminPagePermission('leads')
  const leads = await getLeads()
  
  return <LeadsClientPage initialLeads={leads} />
}
