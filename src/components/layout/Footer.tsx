import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import {
  GithubIcon,
  LinkedinIcon,
  XIcon,
  InstagramIcon,
  DribbbleIcon,
  BehanceIcon,
  YoutubeIcon,
} from "@/components/ui/BrandIcons";
import { siteConfig } from "@/config/site";
import { useGithubSnapshot } from "@/hooks/useGithub";
import { useSocialLinks } from "@/hooks/useSocialLinks";

/**
 * Kept deliberately minimal (logo, a light nav row, social icons,
 * copyright) rather than a full sitemap block -- the command palette
 * (Ctrl/Cmd+K) already gives full-site discovery.
 */
export function Footer() {
  const { data } = useGithubSnapshot();
  const social = useSocialLinks();

  const socialIcons = [
    { href: social.github, label: "GitHub", Icon: GithubIcon, external: true },
    { href: social.linkedin, label: "LinkedIn", Icon: LinkedinIcon, external: true },
    { href: social.twitter, label: "Twitter", Icon: XIcon, external: true },
    { href: social.instagram, label: "Instagram", Icon: InstagramIcon, external: true },
    { href: social.dribbble, label: "Dribbble", Icon: DribbbleIcon, external: true },
    { href: social.behance, label: "Behance", Icon: BehanceIcon, external: true },
    { href: social.youtube, label: "YouTube", Icon: YoutubeIcon, external: true },
    social.email
      ? { href: `mailto:${social.email}`, label: "Email", Icon: Mail, external: false }
      : null,
  ].filter((item): item is NonNullable<typeof item> => Boolean(item?.href));

  return (
    <footer className="border-t border-[--color-border]">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <Link to="/" className="font-[--font-display] text-sm font-semibold tracking-tight">
            {siteConfig.siteName}
          </Link>

          <nav
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
            aria-label="Footer"
          >
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-sm text-[--color-text-muted] hover:text-[--color-text]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {socialIcons.map(({ href, label, Icon, external }) => (
              <a
                key={label}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                aria-label={label}
                className="text-[--color-text-muted] transition-colors hover:text-[--color-text]"
              >
                <Icon width={17} height={17} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 border-t border-[--color-border] pt-6 text-xs text-[--color-text-faint] sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.siteName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {siteConfig.footerLegal.map((item) => (
              <Link key={item.href} to={item.href} className="hover:text-[--color-text-muted]">
                {item.label}
              </Link>
            ))}
            {data?.generatedAt && (
              <span>
                Synced{" "}
                <time dateTime={data.generatedAt}>
                  {new Date(data.generatedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                </time>
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
