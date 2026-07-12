export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  startDate: string; // ISO date
  endDate: string | null; // null = present
  location: string | null;
  description: string;
  achievements: string[];
  technologies: string[];
  companyLogoUrl: string | null;
  companyUrl: string | null;
  order: number;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  major: string | null;
  minor: string | null;
  startDate: string;
  endDate: string | null;
  cgpa: string | null;
  achievements: string[];
  activities: string[];
  order: number;
}

export interface CertificateEntry {
  id: string;
  title: string;
  organization: string;
  imageUrl: string;
  credentialId: string | null;
  credentialUrl: string | null;
  issueDate: string;
  expiryDate: string | null;
  featured: boolean;
  tags: string[];
  order: number;
}

export interface BlogPostEntry {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentMdx: string;
  coverImageUrl: string | null;
  tags: string[];
  category: string;
  status: "draft" | "published";
  publishedAt: string | null;
  readingTimeMinutes: number;
  order: number;
}

export type SkillCategory =
  | "Frontend"
  | "Backend"
  | "AI"
  | "Machine Learning"
  | "Cloud"
  | "DevOps"
  | "Security"
  | "Programming"
  | "Database"
  | "Testing"
  | "Tools";

export interface SkillEntry {
  id: string;
  name: string;
  category: SkillCategory;
  level: number; // 0-100
  yearsExperience: number;
  iconUrl: string | null;
  projectsUsingSkill: number;
  order: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  mediaUrl: string;
  mediaType: "image" | "video";
  tags: string[];
  order: number;
}

export interface TestimonialEntry {
  id: string;
  authorName: string;
  authorRole: string | null;
  authorCompany: string | null;
  authorAvatarUrl: string | null;
  quote: string;
  linkUrl: string | null;
  featured: boolean;
  order: number;
}

export interface ResumeSettings {
  resumeUrl: string | null;
  updatedAt: string | null;
}

export interface NowPlayingSettings {
  enabled: boolean;
  provider: "manual" | "spotify" | "lastfm";
  trackName: string | null;
  artistName: string | null;
  trackUrl: string | null;
  albumArtUrl: string | null;
  updatedAt: string | null;
}
