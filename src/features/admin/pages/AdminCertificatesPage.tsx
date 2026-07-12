import { AdminEntityPage } from "@/features/admin/components/AdminEntityPage";
import { certificatesConfig } from "@/features/admin/config/entities";

export function AdminCertificatesPage() {
  return <AdminEntityPage config={certificatesConfig} />;
}
