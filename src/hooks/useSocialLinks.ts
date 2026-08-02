import { useQuery } from "@tanstack/react-query";
import { fetchPublicFirestoreDoc } from "@/services/firestoreRest";
import { siteConfig } from "@/config/site";

interface SocialDoc extends Record<string, unknown> {
  linkedin: string;
  twitter: string;
  instagram: string;
  dribbble: string;
  behance: string;
  youtube: string;
  email: string;
}

/**
 * Reads social links via the plain Firestore REST API (see
 * services/firestoreRest.ts) rather than the SDK, specifically so this
 * hook is safe to use from the always-mounted Footer without pulling the
 * Firebase SDK into every page's bundle. Falls back to the static values
 * in src/config/site.ts if Firestore has nothing saved yet, or if
 * VITE_FIREBASE_PROJECT_ID isn't configured at all.
 */
export function useSocialLinks() {
  const { data } = useQuery({
    queryKey: ["public-settings", "social"],
    queryFn: () => fetchPublicFirestoreDoc<SocialDoc>("settings", "social"),
    staleTime: 1000 * 60 * 10,
  });

  return {
    github: siteConfig.social.github, // structural fact, not a setting
    linkedin: (data?.linkedin as string) || siteConfig.social.linkedin,
    twitter: (data?.twitter as string) || siteConfig.social.twitter,
    instagram: (data?.instagram as string) || siteConfig.social.instagram,
    dribbble: (data?.dribbble as string) || siteConfig.social.dribbble,
    behance: (data?.behance as string) || siteConfig.social.behance,
    youtube: (data?.youtube as string) || siteConfig.social.youtube,
    email: (data?.email as string) || siteConfig.social.email,
  };
}
