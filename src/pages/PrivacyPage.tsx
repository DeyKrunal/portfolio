import { useSeo } from "@/hooks/useSeo";

export function PrivacyPage() {
  useSeo({ title: "Privacy Policy", path: "/privacy" });

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-[--font-display] text-[length:--text-3xl] font-semibold tracking-tight">
        Privacy Policy
      </h1>
      <div className="prose prose-neutral mt-8 max-w-none space-y-4 text-sm text-[--color-text-muted]">
        <p>Last updated: {new Date().toLocaleDateString(undefined, { dateStyle: "long" })}</p>

        <p>
          This site is a static personal portfolio. It doesn't run its own backend server, so
          most of what a typical privacy policy covers (server logs, session data) simply doesn't
          exist here. What follows is a straightforward account of what does happen.
        </p>

        <h2 className="font-[--font-display] text-base font-semibold text-[--color-text]">
          Contact form
        </h2>
        <p>
          Submitting the contact form sends your name, email, and message to this site's owner via
          EmailJS. That data is not stored by this site; it's relayed to an inbox. A short
          browser-local cool-down prevents rapid resubmission but isn't sent anywhere.
        </p>

        <h2 className="font-[--font-display] text-base font-semibold text-[--color-text]">
          Theme preference
        </h2>
        <p>
          Your light/dark/system theme choice is stored in your browser's local storage only. It
          never leaves your device.
        </p>

        <h2 className="font-[--font-display] text-base font-semibold text-[--color-text]">
          Hosting
        </h2>
        <p>
          This site is hosted on GitHub Pages. GitHub, as the hosting provider, may log standard
          web server access data (IP address, user agent) per their own privacy policy.
        </p>

        <h2 className="font-[--font-display] text-base font-semibold text-[--color-text]">
          Questions
        </h2>
        <p>Reach out via the contact page if you have questions about this policy.</p>
      </div>
    </section>
  );
}
