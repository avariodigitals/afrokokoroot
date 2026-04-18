import { getSiteSettings, getStorageStatus } from "@/lib/api";
import AdminStorageNotice from "@/components/admin/AdminStorageNotice";
import SettingsForm from "@/components/admin/SettingsForm";
import { requireAdminPagePermission } from "@/lib/admin-auth";

export default async function SettingsPage() {
  await requireAdminPagePermission('settings');
  const siteSettings = await getSiteSettings();
  const storageStatus = getStorageStatus();

  return (
    <div className="space-y-6">
      <AdminStorageNotice status={storageStatus} />

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Site Settings</h1>
        <p className="text-slate-500">Manage contact details, donation checkout, SEO, Search Console API access, and tracking integrations.</p>
      </div>

      <SettingsForm initialData={siteSettings} />
    </div>
  );
}
