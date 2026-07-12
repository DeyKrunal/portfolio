export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "boolean"
  | "tags"
  | "select"
  | "image"
  | "url";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[]; // for "select"
  helpText?: string;
}

export interface EntityConfig {
  collectionName: string;
  singularLabel: string;
  pluralLabel: string;
  fields: FieldConfig[];
  titleField: string; // which field to show as the row's primary label
  subtitleField?: string;
}
