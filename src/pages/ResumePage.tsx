import { Download, FileText } from "lucide-react";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import { EmptyState } from "@/components/common/EmptyState";
import { useSeo } from "@/hooks/useSeo";
import type { ResumeSettings } from "@/types/content";

export function ResumePage() {
  useSeo({ title: "Resume", path: "/resume" });

  const { data: settings, isLoading } = useFirestoreDoc<ResumeSettings>("settings", "resume");

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-[--font-display] text-[length:--text-3xl] font-semibold tracking-tight">
          Resume
        </h1>
        {settings?.resumeUrl && (
          <a
            href={settings.resumeUrl}
            download
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full bg-[--color-accent] px-5 py-2.5 text-sm font-medium text-[--color-accent-contrast]"
          >
            <Download size={15} /> Download PDF
          </a>
        )}
      </div>

      {isLoading && (
        <div className="mt-8 h-[70vh] animate-pulse rounded-[--radius-lg] bg-[--color-bg-subtle]" />
      )}

      {!isLoading && !settings?.resumeUrl && (
        <div className="mt-8">
          <EmptyState
            icon={FileText}
            title="No resume uploaded yet"
            description="Upload a PDF from Admin → Settings → Resume. It'll be embedded here and available as a download."
          />
        </div>
      )}

      {settings?.resumeUrl && (
        <div className="mt-8 overflow-hidden rounded-[--radius-lg] border border-[--color-border]">
          <object
            data={settings.resumeUrl}
            type="application/pdf"
            className="h-[75vh] w-full"
            aria-label="Resume PDF preview"
          >
            <p className="p-6 text-sm text-[--color-text-muted]">
              Your browser can't preview PDFs inline.{" "}
              <a href={settings.resumeUrl} className="text-[--color-accent] hover:underline">
                Open the PDF directly
              </a>
              .
            </p>
          </object>
        </div>
      )}
    </section>
  );
}
