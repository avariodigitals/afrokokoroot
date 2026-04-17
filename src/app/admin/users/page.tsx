import AdminUsersPage from '@/components/admin/AdminUsersPage'
import { getCurrentAdminUser, listAdminUsers, requireAdminPagePermission } from '@/lib/admin-auth'

export default async function UsersPage() {
  const currentUser = await requireAdminPagePermission('users')
  const users = await listAdminUsers()
  const sessionUser = await getCurrentAdminUser()

  return <AdminUsersPage initialUsers={users} currentUserId={sessionUser?.id || currentUser.id} />
}
