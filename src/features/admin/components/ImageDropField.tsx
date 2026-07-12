import { useRef, useState } from "react";
import { UploadCloud, Loader2, X, Link2 } from "lucide-react";
import { useStorageUpload } from "@/features/admin/hooks/useStorageUpload";
import { cn } from "@/lib/cn";

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  accept?: string;
}

type Mode = "upload" | "url";

export function ImageDropField({
  label,
  value,
  onChange,
  required,
  accept = "image/*",
}: ImageFieldProps) {
  const { upload, progress, error } = useStorageUpload();
  const [dragActive, setDragActive] = useState(false);
  const [mode, setMode] = useState<Mode>("upload");
  const [urlDraft, setUrlDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    try {
      const url = await upload(file);
      onChange(url);
    } catch {
      // error surfaced via the hook's error state below
    }
  }

  function handleUrlSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = urlDraft.trim();
    if (trimmed) onChange(trimmed);
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="block text-sm font-medium">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
        {!value && (
          <div className="flex overflow-hidden rounded-full border border-[--color-border] text-xs">
            <button
              type="button"
              onClick={() => setMode("upload")}
              className={cn(
                "px-2.5 py-1",
                mode === "upload"
                  ? "bg-[--color-accent] text-[--color-accent-contrast]"
                  : "text-[--color-text-muted]"
              )}
            >
              Upload
            </button>
            <button
              type="button"
              onClick={() => setMode("url")}
              className={cn(
                "px-2.5 py-1",
                mode === "url"
                  ? "bg-[--color-accent] text-[--color-accent-contrast]"
                  : "text-[--color-text-muted]"
              )}
            >
              Paste URL
            </button>
          </div>
        )}
      </div>

      {value ? (
        <div className="relative w-fit">
          {/\.pdf($|\?)/i.test(value) ? (
            <div className="flex h-32 w-32 flex-col items-center justify-center gap-1 rounded-[--radius-md] border border-[--color-border] bg-[--color-bg-subtle] text-center">
              <span className="text-xs font-medium text-[--color-text-muted]">PDF</span>
              <span className="max-w-[7rem] truncate px-2 text-[10px] text-[--color-text-faint]">
                {value.split("/").pop()}
              </span>
            </div>
          ) : (
            <img
              src={value}
              alt=""
              className="h-32 w-32 rounded-[--radius-md] border border-[--color-border] object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
          <button
            type="button"
            onClick={() => {
              onChange("");
              setUrlDraft("");
            }}
            aria-label="Remove image"
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white"
          >
            <X size={12} />
          </button>
        </div>
      ) : mode === "upload" ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex h-32 w-full max-w-xs cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[--radius-md] border border-dashed text-center transition-colors",
            dragActive
              ? "border-[--color-accent] bg-[--color-accent]/5"
              : "border-[--color-border] hover:border-[--color-border-strong]"
          )}
        >
          {progress !== null ? (
            <>
              <Loader2 size={18} className="animate-spin text-[--color-accent]" />
              <span className="text-xs text-[--color-text-muted]">{progress}%</span>
            </>
          ) : (
            <>
              <UploadCloud size={18} className="text-[--color-text-faint]" />
              <span className="text-xs text-[--color-text-muted]">
                {accept.includes("pdf") ? "Drop file or click" : "Drop image or click"}
              </span>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      ) : (
        <form onSubmit={handleUrlSubmit} className="flex max-w-xs gap-2">
          <div className="relative flex-1">
            <Link2
              size={14}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[--color-text-faint]"
            />
            <input
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              placeholder="/documents/resume.pdf or https://..."
              className="w-full rounded-[--radius-md] border border-[--color-border] bg-[--color-surface] py-2 pl-8 pr-2 text-xs outline-none focus-visible:border-[--color-accent]"
            />
          </div>
          <button
            type="submit"
            className="shrink-0 rounded-[--radius-md] bg-[--color-accent] px-3 py-2 text-xs font-medium text-[--color-accent-contrast]"
          >
            Use
          </button>
        </form>
      )}
      {mode === "url" && !value && (
        <p className="mt-1.5 text-xs text-[--color-text-faint]">
          Use this for files committed directly to the repo's <code>public/</code> folder (e.g. a
          resume PDF that rarely changes) instead of uploading to Firebase Storage.
        </p>
      )}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
