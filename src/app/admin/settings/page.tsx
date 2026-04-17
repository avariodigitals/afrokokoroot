import { getContactInfo, getStorageStatus } from "@/lib/api";
import AdminStorageNotice from "@/components/admin/AdminStorageNotice";
import SettingsForm from "@/components/admin/SettingsForm";
import { requireAdminPagePermission } from "@/lib/admin-auth";

export default async function SettingsPage() {
  await requireAdminPagePermission('settings');
  const contactInfo = await getContactInfo();
  const storageStatus = getStorageStatus();

  return (
    <div className="space-y-6">
      <AdminStorageNotice status={storageStatus} />

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Site Settings</h1>
        <p className="text-slate-500">Manage your organization's contact information and social media links.</p>
      </div>

      <SettingsForm initialData={contactInfo} />
    </div>
  );
}
