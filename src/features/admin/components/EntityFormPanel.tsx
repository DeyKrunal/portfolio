import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import type { EntityConfig } from "@/features/admin/config/fieldTypes";
import { ImageDropField } from "@/features/admin/components/ImageDropField";
import { TagsField } from "@/features/admin/components/TagsField";

interface EntityFormPanelProps {
  config: EntityConfig;
  initialValues: Record<string, unknown> | null; // null = create mode
  onClose: () => void;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
}

function defaultValueFor(type: string) {
  switch (type) {
    case "boolean":
      return false;
    case "tags":
      return [];
    case "number":
      return 0;
    default:
      return "";
  }
}

export function EntityFormPanel({
  config,
  initialValues,
  onClose,
  onSubmit,
}: EntityFormPanelProps) {
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const base: Record<string, unknown> = {};
    for (const field of config.fields) {
      base[field.name] =
        initialValues?.[field.name] ?? defaultValueFor(field.type);
    }
    setValues(base);
  }, [config.fields, initialValues]);

  function setField(name: string, value: unknown) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    for (const field of config.fields) {
      if (field.required) {
        const v = values[field.name];
        if (v === "" || v === null || v === undefined || (Array.isArray(v) && v.length === 0)) {
          setFormError(`"${field.label}" is required.`);
          return;
        }
      }
    }

    setSaving(true);
    try {
      await onSubmit(values);
      onClose();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[90] flex justify-end bg-black/40" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${initialValues ? "Edit" : "Add"} ${config.singularLabel}`}
        className="flex h-full w-full max-w-md flex-col bg-[--color-surface] shadow-[--shadow-lg]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[--color-border] px-5 py-4">
          <h2 className="font-[--font-display] text-base font-semibold">
            {initialValues ? `Edit ${config.singularLabel}` : `Add ${config.singularLabel}`}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-[--color-text-faint] hover:text-[--color-text]"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex-1 space-y-5 px-5 py-5">
            {config.fields.map((field) => (
              <div key={field.name}>
                {field.type === "text" && (
                  <TextInput field={field} value={values[field.name] as string} onChange={setField} />
                )}
                {field.type === "url" && (
                  <TextInput
                    field={field}
                    value={values[field.name] as string}
                    onChange={setField}
                    type="url"
                  />
                )}
                {field.type === "textarea" && (
                  <TextArea field={field} value={values[field.name] as string} onChange={setField} />
                )}
                {field.type === "number" && (
                  <TextInput
                    field={field}
                    value={String(values[field.name] ?? "")}
                    onChange={(name, v) => setField(name, Number(v))}
                    type="number"
                  />
                )}
                {field.type === "date" && (
                  <TextInput
                    field={field}
                    value={(values[field.name] as string)?.slice(0, 10) ?? ""}
                    onChange={setField}
                    type="date"
                  />
                )}
                {field.type === "boolean" && (
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={Boolean(values[field.name])}
                      onChange={(e) => setField(field.name, e.target.checked)}
                      className="h-4 w-4 rounded border-[--color-border]"
                    />
                    {field.label}
                  </label>
                )}
                {field.type === "tags" && (
                  <TagsField
                    label={field.label}
                    value={(values[field.name] as string[]) ?? []}
                    onChange={(v) => setField(field.name, v)}
                    placeholder={field.placeholder}
                  />
                )}
                {field.type === "select" && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      {field.label}
                      {field.required && <span className="text-red-500"> *</span>}
                    </label>
                    <select
                      value={(values[field.name] as string) ?? ""}
                      onChange={(e) => setField(field.name, e.target.value)}
                      className="w-full rounded-[--radius-md] border border-[--color-border] bg-[--color-surface] px-3 py-2 text-sm outline-none focus-visible:border-[--color-accent]"
                    >
                      <option value="" disabled>
                        Select...
                      </option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {field.type === "image" && (
                  <ImageDropField
                    label={field.label}
                    value={(values[field.name] as string) ?? ""}
                    onChange={(url) => setField(field.name, url)}
                    required={field.required}
                  />
                )}
                {field.helpText && (
                  <p className="mt-1 text-xs text-[--color-text-faint]">{field.helpText}</p>
                )}
              </div>
            ))}
          </div>

          {formError && (
            <p className="mx-5 mb-3 rounded-[--radius-md] bg-red-500/10 px-3 py-2 text-xs text-red-500">
              {formError}
            </p>
          )}

          <div className="flex gap-2 border-t border-[--color-border] px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-[--color-border] px-4 py-2 text-sm font-medium hover:bg-[--color-bg-subtle]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[--color-accent] px-4 py-2 text-sm font-medium text-[--color-accent-contrast] disabled:opacity-60"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TextInput({
  field,
  value,
  onChange,
  type = "text",
}: {
  field: { name: string; label: string; required?: boolean; placeholder?: string };
  value: string;
  onChange: (name: string, value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={field.name} className="mb-1.5 block text-sm font-medium">
        {field.label}
        {field.required && <span className="text-red-500"> *</span>}
      </label>
      <input
        id={field.name}
        type={type}
        value={value ?? ""}
        placeholder={field.placeholder}
        onChange={(e) => onChange(field.name, e.target.value)}
        className="w-full rounded-[--radius-md] border border-[--color-border] bg-[--color-surface] px-3 py-2 text-sm outline-none focus-visible:border-[--color-accent]"
      />
    </div>
  );
}

function TextArea({
  field,
  value,
  onChange,
}: {
  field: { name: string; label: string; required?: boolean; placeholder?: string };
  value: string;
  onChange: (name: string, value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={field.name} className="mb-1.5 block text-sm font-medium">
        {field.label}
        {field.required && <span className="text-red-500"> *</span>}
      </label>
      <textarea
        id={field.name}
        rows={4}
        value={value ?? ""}
        placeholder={field.placeholder}
        onChange={(e) => onChange(field.name, e.target.value)}
        className="w-full rounded-[--radius-md] border border-[--color-border] bg-[--color-surface] px-3 py-2 text-sm outline-none focus-visible:border-[--color-accent]"
      />
    </div>
  );
}
