import AdminShell from '@/components/admin/AdminShell'
import { getCurrentAdminUser } from '@/lib/admin-auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentAdminUser()

  return <AdminShell currentUser={currentUser}>{children}</AdminShell>
}
