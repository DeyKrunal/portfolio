import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/ui/BrandIcons";
import { siteConfig } from "@/config/site";
import { useGithubSnapshot } from "@/hooks/useGithub";
import { useSocialLinks } from "@/hooks/useSocialLinks";

export function Footer() {
  const { data } = useGithubSnapshot();
  const social = useSocialLinks();

  return (
    <footer className="border-t border-[--color-border]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[--color-text-faint]">
              Explore
            </p>
            <ul className="space-y-2">
              {siteConfig.footerNav.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm text-[--color-text-muted] hover:text-[--color-text]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[--color-text-faint]">
              Legal
            </p>
            <ul className="space-y-2">
              {siteConfig.footerLegal.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm text-[--color-text-muted] hover:text-[--color-text]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[--color-text-faint]">
              Connect
            </p>
            <div className="flex items-center gap-3">
              <a
                href={social.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="text-[--color-text-muted] transition-colors hover:text-[--color-text]"
              >
                <GithubIcon width={18} height={18} />
              </a>
              {social.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="text-[--color-text-muted] transition-colors hover:text-[--color-text]"
                >
                  <LinkedinIcon width={18} height={18} />
                </a>
              )}
              {social.twitter && (
                <a
                  href={social.twitter}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter"
                  className="text-[--color-text-muted] transition-colors hover:text-[--color-text]"
                >
                  <XIcon width={18} height={18} />
                </a>
              )}
              {social.email && (
                <a
                  href={`mailto:${social.email}`}
                  aria-label="Email"
                  className="text-[--color-text-muted] transition-colors hover:text-[--color-text]"
                >
                  <Mail size={18} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-[--color-border] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[--color-text-muted]">
            © {new Date().getFullYear()} {siteConfig.siteName}. Built with React, shipped on
            GitHub Pages.
          </p>
          {data?.generatedAt && (
            <p className="text-xs text-[--color-text-faint]">
              GitHub data last synced{" "}
              <time dateTime={data.generatedAt}>
                {new Date(data.generatedAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </time>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
