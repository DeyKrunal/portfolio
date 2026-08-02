import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2, AlertCircle, Mail } from "lucide-react";
import { useSeo } from "@/hooks/useSeo";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/ui/BrandIcons";

const PROJECT_TYPES = [
  "Web Application",
  "Mobile App",
  "System Architecture / Consulting",
  "AI / ML Solution",
  "Cloud Migration / DevOps",
  "UI/UX Design",
  "Other",
] as const;

const BUDGET_RANGES = [
  "Under $5k",
  "$5k – $15k",
  "$15k – $50k",
  "$50k+",
  "Not sure yet",
] as const;

const contactSchema = z.object({
  name: z.string().min(2, "Enter your name").max(100),
  email: z.string().email("Enter a valid email"),
  companyName: z.string().max(150).optional(),
  projectType: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10, "Message should be at least 10 characters").max(2000),
  // Honeypot: real users never fill this (it's visually hidden); bots often do.
  // Named distinctly from the real "companyName" field above.
  website: z.string().max(0, "").optional(),
});

type ContactForm = z.infer<typeof contactSchema>;

// Simple client-side rate limit: block resubmission within this window.
// This is not a substitute for server-side protection, but there is no
// server here — EmailJS + this cool-down is the realistic ceiling for a
// fully static site. Document this tradeoff, don't pretend otherwise.
const RATE_LIMIT_MS = 60_000;
const RATE_LIMIT_KEY = "portfolio-last-contact-submit";

export function ContactPage() {
  useSeo({ title: "Contact", path: "/contact" });
  const social = useSocialLinks();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error" | "rate-limited">(
    "idle"
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(values: ContactForm) {
    if (values.website) return; // honeypot tripped — silently drop

    const last = Number(localStorage.getItem(RATE_LIMIT_KEY) ?? 0);
    if (Date.now() - last < RATE_LIMIT_MS) {
      setStatus("rate-limited");
      return;
    }

    setStatus("sending");
    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error("EmailJS is not configured (missing VITE_EMAILJS_* env vars)");
      }

      const emailjs = await import("@emailjs/browser");
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: values.name,
          from_email: values.email,
          company: values.companyName || "—",
          project_type: values.projectType || "—",
          budget: values.budget || "—",
          message: values.message,
        },
        { publicKey }
      );

      localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
      setStatus("sent");
      reset();
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  const socialCards = [
    social.email && {
      label: "Email",
      value: social.email,
      href: `mailto:${social.email}`,
      icon: Mail,
    },
    { label: "GitHub", value: "@DeyKrunal", href: social.github, icon: GithubIcon },
    social.linkedin && { label: "LinkedIn", value: "Connect", href: social.linkedin, icon: LinkedinIcon },
    social.twitter && { label: "X / Twitter", value: "Follow", href: social.twitter, icon: XIcon },
  ].filter(Boolean) as { label: string; value: string; href: string; icon: React.ComponentType<{ size?: number }> }[];

  const inputClass =
    "w-full rounded-[--radius-md] border border-[--color-border] bg-[--color-surface] px-4 py-2.5 text-sm outline-none focus-visible:border-[--color-accent-from]";

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[--color-accent-from]">
        Let's build something
      </p>
      <h1 className="font-[--font-display] text-[length:--text-3xl] font-bold tracking-tight">
        Get in touch
      </h1>
      <p className="mt-2 max-w-lg text-[--color-text-muted]">
        Have a project, role, or question in mind? Send a message directly — no inbox
        middleman.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                {...register("name")}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={inputClass}
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-xs text-[--color-error]">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={inputClass}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-xs text-[--color-error]">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="companyName" className="mb-1.5 block text-sm font-medium">
              Company <span className="text-[--color-text-faint]">(optional)</span>
            </label>
            <input id="companyName" {...register("companyName")} className={inputClass} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="projectType" className="mb-1.5 block text-sm font-medium">
                Project type <span className="text-[--color-text-faint]">(optional)</span>
              </label>
              <select id="projectType" {...register("projectType")} className={inputClass}>
                <option value="">Select...</option>
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="budget" className="mb-1.5 block text-sm font-medium">
                Budget <span className="text-[--color-text-faint]">(optional)</span>
              </label>
              <select id="budget" {...register("budget")} className={inputClass}>
                <option value="">Select...</option>
                {BUDGET_RANGES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              {...register("message")}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
              className={inputClass}
            />
            {errors.message && (
              <p id="message-error" className="mt-1 text-xs text-[--color-error]">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Honeypot field — hidden from sighted users, but present in the DOM/tab order for bots */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
            aria-hidden="true"
          />

          <button
            type="submit"
            disabled={status === "sending"}
            className="btn-primary flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold disabled:opacity-60"
          >
            {status === "sending" && <Loader2 size={15} className="animate-spin" />}
            Send message
          </button>

          {status === "sent" && (
            <p className="flex items-center gap-2 text-sm text-[--color-success]">
              <CheckCircle2 size={15} /> Message sent. Thanks for reaching out.
            </p>
          )}
          {status === "error" && (
            <p className="flex items-center gap-2 text-sm text-[--color-error]">
              <AlertCircle size={15} /> Something went wrong. Try again in a moment.
            </p>
          )}
          {status === "rate-limited" && (
            <p className="flex items-center gap-2 text-sm text-[--color-warning]">
              <AlertCircle size={15} /> Please wait a minute before sending another message.
            </p>
          )}
        </form>

        <div className="flex flex-col gap-3">
          {socialCards.map((card) => (
            <a
              key={card.label}
              href={card.href}
              target={card.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noreferrer"
              className="card-premium flex items-center gap-3 p-4"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[--color-accent-from]/10 to-[--color-accent-to]/10 text-[--color-accent-from]">
                <card.icon size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-[--color-text-faint]">{card.label}</p>
                <p className="truncate text-sm font-medium">{card.value}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
