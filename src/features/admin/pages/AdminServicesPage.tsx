import { AdminEntityPage } from "@/features/admin/components/AdminEntityPage";
import { servicesConfig } from "@/features/admin/config/entities";

export function AdminServicesPage() {
  return <AdminEntityPage config={servicesConfig} />;
}
