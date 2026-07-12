import { AdminEntityPage } from "@/features/admin/components/AdminEntityPage";
import { testimonialsConfig } from "@/features/admin/config/entities";

export function AdminTestimonialsPage() {
  return <AdminEntityPage config={testimonialsConfig} />;
}
