import { AdminEntityPage } from "@/features/admin/components/AdminEntityPage";
import { skillsConfig } from "@/features/admin/config/entities";

export function AdminSkillsPage() {
  return <AdminEntityPage config={skillsConfig} />;
}
