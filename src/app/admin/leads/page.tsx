import { getLeads } from "@/lib/api"
import { LeadsClientPage } from "./client-page"

export const dynamic = 'force-dynamic'

export default async function AdminLeadsPage() {
  const leads = await getLeads()
  
  return <LeadsClientPage initialLeads={leads} />
}
