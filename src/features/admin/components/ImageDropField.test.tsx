import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ImageDropField } from "@/features/admin/components/ImageDropField";

describe("ImageDropField", () => {
  it("defaults to Upload mode with no value", () => {
    render(<ImageDropField label="Resume" value="" onChange={() => {}} />);
    expect(screen.getByText(/Drop image or click/i)).toBeInTheDocument();
  });

  it("switches to Paste URL mode and accepts a manual URL", () => {
    const onChange = vi.fn();
    render(<ImageDropField label="Resume" value="" onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Paste URL" }));

    const input = screen.getByPlaceholderText(/documents\/resume\.pdf/i);
    fireEvent.change(input, { target: { value: "/documents/resume.pdf" } });
    fireEvent.click(screen.getByRole("button", { name: "Use" }));

    expect(onChange).toHaveBeenCalledWith("/documents/resume.pdf");
  });

  it("shows a PDF placeholder instead of trying to render a PDF as an image", () => {
    render(
      <ImageDropField label="Resume" value="/documents/resume.pdf" onChange={() => {}} />
    );
    expect(screen.getByText("PDF")).toBeInTheDocument();
  });

  it("clears the value and returns to the mode toggle when removed", () => {
    const onChange = vi.fn();
    render(<ImageDropField label="Resume" value="/documents/resume.pdf" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Remove image" }));
    expect(onChange).toHaveBeenCalledWith("");
  });
});
