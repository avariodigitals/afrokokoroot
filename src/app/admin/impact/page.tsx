import { getImpactMetrics } from "@/lib/api";
import ImpactForm from "@/components/admin/ImpactForm";
import { requireAdminPagePermission } from "@/lib/admin-auth";

export default async function ImpactPage() {
  await requireAdminPagePermission('impact');
  const metrics = await getImpactMetrics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Impact Metrics</h1>
        <p className="text-slate-500">Manage the key statistics displayed on the home page.</p>
      </div>

      <ImpactForm initialData={metrics} />
    </div>
  );
}
