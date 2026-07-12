import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

vi.mock("@/features/admin/hooks/useAuth", () => ({
  useAuth: () => ({ user: null, loading: false, isAdmin: false }),
}));

import { ProtectedRoute } from "@/features/admin/components/ProtectedRoute";

describe("ProtectedRoute", () => {
  it("redirects to /admin/login when there is no authenticated admin user", () => {
    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<div>Secret dashboard</div>} />
          </Route>
          <Route path="/admin/login" element={<div>Login page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Login page")).toBeInTheDocument();
    expect(screen.queryByText("Secret dashboard")).not.toBeInTheDocument();
  });
});
