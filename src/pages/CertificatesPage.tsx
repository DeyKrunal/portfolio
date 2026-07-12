import { Award, ExternalLink } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { EmptyState } from "@/components/common/EmptyState";
import { useSeo } from "@/hooks/useSeo";
import type { CertificateEntry } from "@/types/content";

export function CertificatesPage() {
  useSeo({ title: "Certificates", path: "/certificates" });

  const { data: certs, isLoading } = useFirestoreCollection<CertificateEntry>(
    "certificates",
    "order"
  );

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="font-[--font-display] text-[length:--text-3xl] font-semibold tracking-tight">
        Certificates
      </h1>

      {isLoading && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-[--radius-lg] bg-[--color-bg-subtle]" />
          ))}
        </div>
      )}

      {!isLoading && (!certs || certs.length === 0) && (
        <div className="mt-8">
          <EmptyState
            icon={Award}
            title="No certificates added yet"
            description="Upload certificates from Admin → Certificates, with issuer, credential ID, and verification link."
          />
        </div>
      )}

      {certs && certs.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certs.map((cert) => (
            <div
              key={cert.id}
              className="flex flex-col overflow-hidden rounded-[--radius-lg] border border-[--color-border] bg-[--color-surface]"
            >
              <img
                src={cert.imageUrl}
                alt={cert.title}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="flex flex-1 flex-col gap-2 p-4">
                <p className="font-[--font-display] text-sm font-semibold">{cert.title}</p>
                <p className="text-xs text-[--color-text-faint]">{cert.organization}</p>
                <p className="text-xs text-[--color-text-faint]">
                  Issued {new Date(cert.issueDate).toLocaleDateString(undefined, { dateStyle: "medium" })}
                </p>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto flex items-center gap-1 text-xs text-[--color-accent] hover:underline"
                  >
                    <ExternalLink size={12} /> Verify credential
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
