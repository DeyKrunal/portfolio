import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  destructive,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[95] flex items-center justify-center bg-black/40 px-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-[--radius-lg] border border-[--color-border] bg-[--color-surface] p-6 shadow-[--shadow-lg]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          {destructive && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500">
              <AlertTriangle size={16} />
            </span>
          )}
          <div>
            <h2 className="font-[--font-display] text-base font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-[--color-text-muted]">{description}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-full border border-[--color-border] px-4 py-2 text-sm font-medium hover:bg-[--color-bg-subtle]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              try {
                await onConfirm();
              } finally {
                setLoading(false);
              }
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white disabled:opacity-60 ${
              destructive ? "bg-red-500" : "bg-[--color-accent]"
            }`}
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
