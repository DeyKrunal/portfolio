import { describe, it, expect } from "vitest";
import {
  experienceConfig,
  educationConfig,
  skillsConfig,
  certificatesConfig,
  achievementsConfig,
  galleryConfig,
  testimonialsConfig,
} from "@/features/admin/config/entities";

const ALL_CONFIGS = [
  experienceConfig,
  educationConfig,
  skillsConfig,
  certificatesConfig,
  achievementsConfig,
  galleryConfig,
  testimonialsConfig,
];

describe("admin entity configs", () => {
  it.each(ALL_CONFIGS)("$collectionName has a titleField that matches a real field", (config) => {
    const fieldNames = config.fields.map((f) => f.name);
    expect(fieldNames).toContain(config.titleField);
  });

  it.each(ALL_CONFIGS)(
    "$collectionName has a subtitleField that matches a real field, if set",
    (config) => {
      if (config.subtitleField) {
        const fieldNames = config.fields.map((f) => f.name);
        expect(fieldNames).toContain(config.subtitleField);
      }
    }
  );

  it.each(ALL_CONFIGS)("$collectionName has non-empty labels and at least one field", (config) => {
    expect(config.collectionName.length).toBeGreaterThan(0);
    expect(config.singularLabel.length).toBeGreaterThan(0);
    expect(config.pluralLabel.length).toBeGreaterThan(0);
    expect(config.fields.length).toBeGreaterThan(0);
  });

  it.each(ALL_CONFIGS)(
    "$collectionName select fields all declare options",
    (config) => {
      const selectFields = config.fields.filter((f) => f.type === "select");
      for (const field of selectFields) {
        expect(field.options?.length ?? 0).toBeGreaterThan(0);
      }
    }
  );
});
