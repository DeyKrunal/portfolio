import { AdminEntityPage } from "@/features/admin/components/AdminEntityPage";
import { educationConfig } from "@/features/admin/config/entities";

export function AdminEducationPage() {
  return <AdminEntityPage config={educationConfig} />;
}
