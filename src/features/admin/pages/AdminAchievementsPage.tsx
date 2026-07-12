import { AdminEntityPage } from "@/features/admin/components/AdminEntityPage";
import { achievementsConfig } from "@/features/admin/config/entities";

export function AdminAchievementsPage() {
  return <AdminEntityPage config={achievementsConfig} />;
}
