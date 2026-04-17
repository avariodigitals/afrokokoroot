import { AdminPermission, AdminUser, AdminUserProfile } from './types';

export const ADMIN_PERMISSIONS: AdminPermission[] = [
  'dashboard',
  'events',
  'blog',
  'pages',
  'programs',
  'team',
  'gallery',
  'impact',
  'leads',
  'settings',
  'users',
];

export const ADMIN_PERMISSION_LABELS: Record<AdminPermission, string> = {
  dashboard: 'Dashboard',
  events: 'Events',
  blog: 'Blog posts',
  pages: 'Pages',
  programs: 'Programs',
  team: 'Team',
  gallery: 'Gallery',
  impact: 'Impact metrics',
  leads: 'Leads',
  settings: 'Settings',
  users: 'Users & access',
};

export function normalizeAdminPermissions(permissions: AdminPermission[]) {
  return Array.from(new Set(['dashboard', ...permissions])) as AdminPermission[];
}

export function hasAdminPermission(user: AdminUser | AdminUserProfile, permission: AdminPermission) {
  if (user.isOwner) {
    return true;
  }

  return user.permissions.includes(permission);
}
