import { AdminEntityPage } from "@/features/admin/components/AdminEntityPage";
import { galleryConfig } from "@/features/admin/config/entities";

export function AdminGalleryPage() {
  return <AdminEntityPage config={galleryConfig} />;
}
