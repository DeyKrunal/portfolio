import { useCallback, useEffect, useState } from "react";
import { ref, listAll, getDownloadURL, deleteObject } from "firebase/storage";
import { UploadCloud, Trash2, Copy, Check, Loader2 } from "lucide-react";
import { storage, firebaseEnabled } from "@/lib/firebase";
import { useStorageUpload } from "@/features/admin/hooks/useStorageUpload";
import { ConfirmDialog } from "@/features/admin/components/ConfirmDialog";

interface MediaFile {
  fullPath: string;
  name: string;
  url: string;
}

export function AdminMediaLibraryPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<MediaFile | null>(null);
  const { upload, progress } = useStorageUpload();

  const loadFiles = useCallback(async () => {
    if (!storage) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const folderRef = ref(storage, "public");
    const result = await listAll(folderRef);
    const items = await Promise.all(
      result.items.map(async (item) => ({
        fullPath: item.fullPath,
        name: item.name,
        url: await getDownloadURL(item),
      }))
    );
    setFiles(items.reverse());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  async function handleUpload(fileList: FileList | null) {
    if (!fileList) return;
    for (const file of Array.from(fileList)) {
      try {
        await upload(file);
      } catch {
        // error surfaced by useStorageUpload's own state; skip this file, continue with rest
      }
    }
    await loadFiles();
  }

  function copyUrl(url: string, path: string) {
    navigator.clipboard.writeText(url);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 1500);
  }

  return (
    <div>
      <h1 className="font-[--font-display] text-xl font-semibold">Media Library</h1>
      <p className="mt-1 text-sm text-[--color-text-muted]">
        Files uploaded here are publicly readable (per storage.rules) — use for gallery images,
        certificates, resume, and anything else meant to be shown on the site.
      </p>

      {!firebaseEnabled && (
        <p className="mt-4 rounded-[--radius-md] border border-[--color-accent-warn]/30 bg-[--color-accent-warn]/5 px-4 py-3 text-sm text-[--color-accent-warn]">
          Firebase Storage isn't configured yet.
        </p>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleUpload(e.dataTransfer.files);
        }}
        className={`mt-6 flex h-32 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[--radius-lg] border border-dashed text-center transition-colors ${
          dragActive
            ? "border-[--color-accent] bg-[--color-accent]/5"
            : "border-[--color-border] hover:border-[--color-border-strong]"
        }`}
        onClick={() => document.getElementById("media-upload-input")?.click()}
      >
        {progress !== null ? (
          <>
            <Loader2 size={20} className="animate-spin text-[--color-accent]" />
            <span className="text-xs text-[--color-text-muted]">Uploading... {progress}%</span>
          </>
        ) : (
          <>
            <UploadCloud size={20} className="text-[--color-text-faint]" />
            <span className="text-sm text-[--color-text-muted]">
              Drop files here or click to browse
            </span>
          </>
        )}
        <input
          id="media-upload-input"
          type="file"
          multiple
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>

      {loading && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-[--radius-md] bg-[--color-bg-subtle]" />
          ))}
        </div>
      )}

      {!loading && files.length === 0 && (
        <p className="mt-8 text-center text-sm text-[--color-text-muted]">
          No files uploaded yet.
        </p>
      )}

      {!loading && files.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {files.map((file) => (
            <div
              key={file.fullPath}
              className="group relative aspect-square overflow-hidden rounded-[--radius-md] border border-[--color-border] bg-[--color-bg-subtle]"
            >
              {file.name.endsWith(".pdf") ? (
                <div className="flex h-full items-center justify-center text-xs text-[--color-text-faint]">
                  PDF
                </div>
              ) : (
                <img src={file.url} alt={file.name} className="h-full w-full object-cover" />
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => copyUrl(file.url, file.fullPath)}
                  aria-label="Copy URL"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
                >
                  {copiedPath === file.fullPath ? <Check size={14} /> : <Copy size={14} />}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleting(file)}
                  aria-label="Delete file"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white hover:bg-red-500/80"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete this file?"
          description={`"${deleting.name}" will be permanently removed from Storage. Anything referencing this URL will break.`}
          confirmLabel="Delete"
          destructive
          onCancel={() => setDeleting(null)}
          onConfirm={async () => {
            if (storage) {
              await deleteObject(ref(storage, deleting.fullPath));
            }
            setDeleting(null);
            await loadFiles();
          }}
        />
      )}
    </div>
  );
}
