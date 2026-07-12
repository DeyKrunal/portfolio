import { AdminEntityPage } from "@/features/admin/components/AdminEntityPage";
import { experienceConfig } from "@/features/admin/config/entities";

export function AdminExperiencePage() {
  return <AdminEntityPage config={experienceConfig} />;
}
