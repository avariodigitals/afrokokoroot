'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Shield, Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { deleteAdminUser, saveAdminUser } from '@/lib/actions'
import { ADMIN_PERMISSIONS, ADMIN_PERMISSION_LABELS } from '@/lib/admin-permissions'
import { AdminPermission, AdminUserInput, AdminUserProfile } from '@/lib/types'

interface AdminUsersPageProps {
  initialUsers: AdminUserProfile[]
  currentUserId: string
}

const emptyForm: AdminUserInput = {
  name: '',
  username: '',
  password: '',
  permissions: ['dashboard'],
  isActive: true,
  isOwner: false,
}

function formatUtcDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Unknown'
  }

  return date.toISOString().slice(0, 10)
}

function formatUtcDateTime(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Unknown'
  }

  return `${date.toISOString().slice(0, 16).replace('T', ' ')} UTC`
}

export default function AdminUsersPage({ initialUsers, currentUserId }: AdminUsersPageProps) {
  const [users, setUsers] = useState(initialUsers)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [formData, setFormData] = useState<AdminUserInput>(emptyForm)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const sortedPermissions = useMemo(() => ADMIN_PERMISSIONS.filter((permission) => permission !== 'dashboard'), [])

  const resetForm = () => {
    setFormData(emptyForm)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (user: AdminUserProfile) => {
    setFormData({
      id: user.id,
      name: user.name,
      username: user.username,
      password: '',
      permissions: user.permissions,
      isActive: user.isActive,
      isOwner: user.isOwner,
    })
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    resetForm()
  }

  const togglePermission = (permission: AdminPermission) => {
    setFormData((current) => {
      if (current.isOwner) {
        return current
      }

      const nextPermissions = current.permissions.includes(permission)
        ? current.permissions.filter((value) => value !== permission)
        : [...current.permissions, permission]

      return {
        ...current,
        permissions: ['dashboard', ...nextPermissions.filter((value, index, array) => value !== 'dashboard' && array.indexOf(value) === index)],
      }
    })
  }

  const handleOwnerChange = (checked: boolean) => {
    setFormData((current) => ({
      ...current,
      isOwner: checked,
      permissions: checked ? [...ADMIN_PERMISSIONS] : ['dashboard'],
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)

    try {
      const result = await saveAdminUser(formData)

      if (!result.success || !result.user) {
        throw new Error('Failed to save user')
      }

      setUsers((current) => {
        const otherUsers = current.filter((user) => user.id !== result.user.id)
        return [result.user, ...otherUsers].sort((left, right) => {
          if (left.isOwner !== right.isOwner) {
            return left.isOwner ? -1 : 1
          }

          return left.name.localeCompare(right.name)
        })
      })

      setFeedback({
        type: 'success',
        message: formData.id ? 'User updated successfully.' : 'User created successfully.',
      })
      toast.success(formData.id ? 'User updated' : 'User created')
      closeDialog()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to save user'
      setFeedback({ type: 'error', message })
      toast.error(message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (user: AdminUserProfile) => {
    if (!confirm(`Delete ${user.name}?`)) {
      return
    }

    setIsDeleting(user.id)
    try {
      const result = await deleteAdminUser(user.id)

      if (!result.success) {
        throw new Error('Failed to delete user')
      }

      setUsers((current) => current.filter((item) => item.id !== user.id))
      setFeedback({ type: 'success', message: 'User deleted successfully.' })
      toast.success('User deleted')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to delete user'
      setFeedback({ type: 'error', message })
      toast.error(message)
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="space-y-6">
      {feedback ? (
        <div className={`rounded-xl border px-4 py-3 text-sm ${feedback.type === 'success' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-700'}`}>
          {feedback.message}
        </div>
      ) : null}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Users & Access</h1>
          <p className="text-slate-500">Create admin users and choose exactly which backend sections they can access.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) {
            closeDialog()
          } else {
            setIsDialogOpen(true)
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{formData.id ? 'Edit admin user' : 'Create admin user'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(event) => setFormData((current) => ({ ...current, username: event.target.value.toLowerCase() }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">{formData.id ? 'New password' : 'Password'}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password || ''}
                    onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                    placeholder={formData.id ? 'Leave blank to keep current password' : 'Minimum 8 characters'}
                    required={!formData.id}
                  />
                </div>
                <div className="space-y-3">
                  <Label>Account options</Label>
                  <label className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(event) => setFormData((current) => ({ ...current, isActive: event.target.checked }))}
                    />
                    <span>Account is active</span>
                  </label>
                  <label className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.isOwner}
                      onChange={(event) => handleOwnerChange(event.target.checked)}
                    />
                    <span>Owner account with full access</span>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label>Permissions</Label>
                  <p className="text-xs text-slate-500 mt-1">Dashboard access is always included. Owners automatically receive every permission.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sortedPermissions.map((permission) => (
                    <label key={permission} className={`flex items-center gap-3 rounded-lg border px-3 py-3 text-sm ${formData.isOwner ? 'border-slate-200 bg-slate-50 text-slate-400' : 'border-slate-200 text-slate-700'}`}>
                      <input
                        type="checkbox"
                        checked={formData.isOwner || formData.permissions.includes(permission)}
                        onChange={() => togglePermission(permission)}
                        disabled={formData.isOwner}
                      />
                      <span>{ADMIN_PERMISSION_LABELS[permission]}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={closeDialog} disabled={isSaving}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {formData.id ? 'Save changes' : 'Create user'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {users.map((user) => (
          <div key={user.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-slate-900">{user.name}</h2>
                  {user.isOwner ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                      <Shield className="h-3.5 w-3.5" />
                      Owner
                    </span>
                  ) : null}
                  {!user.isActive ? (
                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      Inactive
                    </span>
                  ) : null}
                </div>
                <p className="text-sm text-slate-500 mt-1">@{user.username}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="icon" onClick={() => openEditDialog(user)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(user)}
                  disabled={isDeleting === user.id || user.id === currentUserId}
                >
                  {isDeleting === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {user.permissions.map((permission) => (
                <span key={permission} className="inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-800">
                  {ADMIN_PERMISSION_LABELS[permission]}
                </span>
              ))}
            </div>

            <div className="mt-4 text-xs text-slate-500 space-y-1">
              <p>Created: {formatUtcDate(user.createdAt)}</p>
              {user.lastLoginAt ? <p>Last login: {formatUtcDateTime(user.lastLoginAt)}</p> : <p>Last login: Never</p>}
              {user.id === currentUserId ? <p>This is your current session.</p> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
