import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CommandPaletteTrigger } from "@/components/common/CommandPaletteTrigger";

function renderWithProviders() {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <CommandPaletteTrigger />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("CommandPaletteTrigger", () => {
  it("opens the command palette on Ctrl+K", async () => {
    renderWithProviders();
    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: "Search" })).toBeInTheDocument();
    });
  });

  it("opens the command palette when the visible button is clicked", async () => {
    renderWithProviders();
    fireEvent.click(screen.getByRole("button", { name: /Open search/i }));
    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: "Search" })).toBeInTheDocument();
    });
  });
});
