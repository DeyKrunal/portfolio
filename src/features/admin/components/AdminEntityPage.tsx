import { useState } from "react";
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import {
  useCreateDoc,
  useUpdateDoc,
  useDeleteDoc,
  useReorderDocs,
} from "@/features/admin/hooks/useFirestoreMutations";
import { EntityFormPanel } from "@/features/admin/components/EntityFormPanel";
import { ConfirmDialog } from "@/features/admin/components/ConfirmDialog";
import type { EntityConfig } from "@/features/admin/config/fieldTypes";

interface WithId {
  id: string;
  order?: number;
  [key: string]: unknown;
}

export function AdminEntityPage({ config }: { config: EntityConfig }) {
  const { data: items, isLoading } = useFirestoreCollection<WithId>(
    config.collectionName,
    "order"
  );
  const createMutation = useCreateDoc(config.collectionName);
  const updateMutation = useUpdateDoc(config.collectionName);
  const deleteMutation = useDeleteDoc(config.collectionName);
  const reorderMutation = useReorderDocs(config.collectionName);

  const [panelOpen, setPanelOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WithId | null>(null);
  const [deletingItem, setDeletingItem] = useState<WithId | null>(null);

  async function handleSubmit(values: Record<string, unknown>) {
    if (editingItem) {
      await updateMutation.mutateAsync({ id: editingItem.id, data: values });
    } else {
      const maxOrder = items?.reduce((max, i) => Math.max(max, i.order ?? 0), 0) ?? 0;
      await createMutation.mutateAsync({ ...values, order: maxOrder + 1 });
    }
  }

  function moveItem(index: number, direction: -1 | 1) {
    if (!items) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const reordered = [...items];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    reorderMutation.mutate(reordered.map((item, i) => ({ id: item.id, order: i })));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[--font-display] text-xl font-semibold">{config.pluralLabel}</h1>
          <p className="mt-1 text-sm text-[--color-text-muted]">
            {items?.length ?? 0} {items?.length === 1 ? "entry" : "entries"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingItem(null);
            setPanelOpen(true);
          }}
          className="flex items-center gap-2 rounded-full bg-[--color-accent] px-4 py-2 text-sm font-medium text-[--color-accent-contrast]"
        >
          <Plus size={15} /> Add {config.singularLabel}
        </button>
      </div>

      {isLoading && (
        <div className="mt-8 space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-[--radius-md] bg-[--color-bg-subtle]" />
          ))}
        </div>
      )}

      {!isLoading && (!items || items.length === 0) && (
        <div className="mt-8 rounded-[--radius-lg] border border-dashed border-[--color-border] px-6 py-16 text-center">
          <p className="text-sm text-[--color-text-muted]">
            No {config.pluralLabel.toLowerCase()} yet. Add the first one to get started.
          </p>
        </div>
      )}

      {items && items.length > 0 && (
        <div className="mt-6 divide-y divide-[--color-border] rounded-[--radius-lg] border border-[--color-border] bg-[--color-surface]">
          {items.map((item, i) => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => moveItem(i, -1)}
                  disabled={i === 0}
                  aria-label="Move up"
                  className="text-[--color-text-faint] hover:text-[--color-text] disabled:opacity-30"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(i, 1)}
                  disabled={i === items.length - 1}
                  aria-label="Move down"
                  className="text-[--color-text-faint] hover:text-[--color-text] disabled:opacity-30"
                >
                  <ChevronDown size={14} />
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {String(item[config.titleField] ?? "Untitled")}
                </p>
                {config.subtitleField && (
                  <p className="truncate text-xs text-[--color-text-faint]">
                    {String(item[config.subtitleField] ?? "")}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingItem(item);
                  setPanelOpen(true);
                }}
                aria-label={`Edit ${item[config.titleField]}`}
                className="rounded-full p-2 text-[--color-text-muted] hover:bg-[--color-bg-subtle] hover:text-[--color-text]"
              >
                <Pencil size={15} />
              </button>
              <button
                type="button"
                onClick={() => setDeletingItem(item)}
                aria-label={`Delete ${item[config.titleField]}`}
                className="rounded-full p-2 text-[--color-text-muted] hover:bg-red-500/10 hover:text-red-500"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {panelOpen && (
        <EntityFormPanel
          config={config}
          initialValues={editingItem}
          onClose={() => setPanelOpen(false)}
          onSubmit={handleSubmit}
        />
      )}

      {deletingItem && (
        <ConfirmDialog
          title={`Delete this ${config.singularLabel.toLowerCase()}?`}
          description={`"${deletingItem[config.titleField]}" will be permanently removed. This can't be undone.`}
          confirmLabel="Delete"
          destructive
          onCancel={() => setDeletingItem(null)}
          onConfirm={async () => {
            await deleteMutation.mutateAsync(deletingItem.id);
            setDeletingItem(null);
          }}
        />
      )}

      {reorderMutation.isPending && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-[--color-surface] px-4 py-2 text-xs shadow-[--shadow-md]">
          <Loader2 size={12} className="animate-spin" /> Saving order...
        </div>
      )}
    </div>
  );
}
