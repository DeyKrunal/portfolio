import type { EntityConfig } from "@/features/admin/config/fieldTypes";

export const experienceConfig: EntityConfig = {
  collectionName: "experience",
  singularLabel: "Role",
  pluralLabel: "Experience",
  titleField: "role",
  subtitleField: "company",
  fields: [
    { name: "role", label: "Role", type: "text", required: true },
    { name: "company", label: "Company", type: "text", required: true },
    { name: "location", label: "Location", type: "text" },
    { name: "startDate", label: "Start date", type: "date", required: true },
    { name: "endDate", label: "End date", type: "date", helpText: "Leave empty for \"Present\"" },
    { name: "description", label: "Description", type: "textarea", required: true },
    { name: "achievements", label: "Achievements", type: "tags", placeholder: "Add an achievement..." },
    { name: "technologies", label: "Technologies", type: "tags", placeholder: "Add a technology..." },
    { name: "companyUrl", label: "Company URL", type: "url" },
    { name: "companyLogoUrl", label: "Company logo", type: "image" },
  ],
};

export const educationConfig: EntityConfig = {
  collectionName: "education",
  singularLabel: "Education entry",
  pluralLabel: "Education",
  titleField: "degree",
  subtitleField: "institution",
  fields: [
    { name: "institution", label: "Institution", type: "text", required: true },
    { name: "degree", label: "Degree", type: "text", required: true },
    { name: "major", label: "Major", type: "text" },
    { name: "minor", label: "Minor", type: "text" },
    { name: "startDate", label: "Start date", type: "date", required: true },
    { name: "endDate", label: "End date", type: "date" },
    { name: "cgpa", label: "CGPA / Grade", type: "text" },
    { name: "achievements", label: "Achievements", type: "tags" },
    { name: "activities", label: "Activities", type: "tags" },
  ],
};

export const skillsConfig: EntityConfig = {
  collectionName: "skills",
  singularLabel: "Skill",
  pluralLabel: "Skills",
  titleField: "name",
  subtitleField: "category",
  fields: [
    { name: "name", label: "Skill name", type: "text", required: true },
    {
      name: "category",
      label: "Category",
      type: "select",
      required: true,
      options: [
        "Frontend",
        "Backend",
        "AI",
        "Machine Learning",
        "Cloud",
        "DevOps",
        "Security",
        "Programming",
        "Database",
        "Testing",
        "Tools",
      ],
    },
    { name: "level", label: "Proficiency (0-100)", type: "number", required: true },
    { name: "yearsExperience", label: "Years of experience", type: "number" },
    { name: "projectsUsingSkill", label: "Projects using this skill", type: "number" },
    { name: "iconUrl", label: "Icon", type: "image" },
  ],
};

export const certificatesConfig: EntityConfig = {
  collectionName: "certificates",
  singularLabel: "Certificate",
  pluralLabel: "Certificates",
  titleField: "title",
  subtitleField: "organization",
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "organization", label: "Issuing organization", type: "text", required: true },
    { name: "imageUrl", label: "Certificate image", type: "image", required: true },
    { name: "credentialId", label: "Credential ID", type: "text" },
    { name: "credentialUrl", label: "Verification URL", type: "url" },
    { name: "issueDate", label: "Issue date", type: "date", required: true },
    { name: "expiryDate", label: "Expiry date", type: "date" },
    { name: "featured", label: "Featured", type: "boolean" },
    { name: "tags", label: "Tags", type: "tags" },
  ],
};

export const achievementsConfig: EntityConfig = {
  collectionName: "achievements",
  singularLabel: "Achievement",
  pluralLabel: "Achievements",
  titleField: "title",
  subtitleField: "date",
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea", required: true },
    { name: "date", label: "Date", type: "date", required: true },
    { name: "imageUrl", label: "Image", type: "image" },
    { name: "linkUrl", label: "Link", type: "url" },
    { name: "tags", label: "Tags", type: "tags" },
    { name: "featured", label: "Featured", type: "boolean" },
  ],
};

export const galleryConfig: EntityConfig = {
  collectionName: "gallery",
  singularLabel: "Gallery item",
  pluralLabel: "Gallery",
  titleField: "title",
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea" },
    { name: "mediaUrl", label: "Image", type: "image", required: true },
    { name: "mediaType", label: "Media type", type: "select", options: ["image", "video"], required: true },
    { name: "tags", label: "Tags", type: "tags" },
  ],
};

export const testimonialsConfig: EntityConfig = {
  collectionName: "testimonials",
  singularLabel: "Testimonial",
  pluralLabel: "Testimonials",
  titleField: "authorName",
  subtitleField: "authorCompany",
  fields: [
    { name: "authorName", label: "Author name", type: "text", required: true },
    { name: "authorRole", label: "Author role", type: "text" },
    { name: "authorCompany", label: "Author company", type: "text" },
    { name: "authorAvatarUrl", label: "Author photo", type: "image" },
    { name: "quote", label: "Quote", type: "textarea", required: true },
    { name: "linkUrl", label: "Reference link", type: "url" },
    { name: "featured", label: "Featured", type: "boolean" },
  ],
};
