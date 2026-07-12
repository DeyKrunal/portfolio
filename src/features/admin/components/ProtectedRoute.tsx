import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/features/admin/hooks/useAuth";
import { PageLoader } from "@/components/common/PageLoader";

/**
 * Gates access to /admin/*. This check is a UX convenience only — it
 * decides what the browser renders, not what data can actually be
 * written. The real access boundary is firestore.rules / storage.rules,
 * which independently check request.auth.token.email server-side. Even
 * if someone bypassed this component entirely, writes would still be
 * rejected by Firestore unless their email is in the rules allow-list.
 */
export function ProtectedRoute() {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
