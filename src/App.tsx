import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/features/admin/hooks/useAuth";
import { router } from "@/router";

export function App() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <div className="grain-overlay" aria-hidden="true" />
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
