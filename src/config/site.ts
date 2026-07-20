
export const siteConfig = {
  githubUsername: "DeyKrunal",
  siteName: "Krunal Dey",
  siteTitle: "Krunal Dey — Software Engineer",
  siteDescription:
    "Software engineer building fast, well-crafted products. Projects sync automatically from GitHub.",
  siteUrl: "https://DeyKrunal.github.io",
  social: {
    github: import.meta.env.VITE_GITHUB_LINK ,
    linkedin: import.meta.env.VITE_LINKEDIN_LINK , // fill in Admin > Settings, stored in Firestore, not hardcoded
    twitter: "",
    email: import.meta.env.VITE_EMAIL_LINK ,
  },
  nav: [
    { label: "Projects", href: "/projects" },
    { label: "Experience", href: "/experience" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  footerNav: [
    { label: "Skills", href: "/skills" },
    { label: "Education", href: "/education" },
    { label: "Certificates", href: "/certificates" },
    { label: "Achievements", href: "/achievements" },
    { label: "Gallery", href: "/gallery" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Resume", href: "/resume" },
    { label: "Now Playing", href: "/now-playing" },
    { label: "GitHub Analytics", href: "/analytics" },
  ],
  footerLegal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Changelog", href: "/changelog" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
