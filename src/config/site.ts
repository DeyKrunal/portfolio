export const siteConfig = {
  githubUsername: "DeyKrunal",
  siteName: "Krunal Dey",
  siteTitle: "Krunal Dey — Software Engineer",
  siteDescription:
    "Software engineer building fast, well-crafted products. Projects sync automatically from GitHub.",
  siteUrl: "https://DeyKrunal.github.io",
  social: {
    github: "https://github.com/DeyKrunal",
    linkedin: "", // fill in Admin > Settings, stored in Firestore, not hardcoded
    twitter: "",
    instagram: "",
    dribbble: "",
    behance: "",
    youtube: "",
    email: "",
  },
  nav: [
    { label: "Projects", href: "/projects" },
    { label: "Experience", href: "/experience" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  footerLegal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Changelog", href: "/changelog" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
