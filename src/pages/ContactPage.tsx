import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useSeo } from "@/hooks/useSeo";

const contactSchema = z.object({
  name: z.string().min(2, "Enter your name").max(100),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(10, "Message should be at least 10 characters").max(2000),
  // Honeypot: real users never fill this (it's visually hidden); bots often do.
  company: z.string().max(0, "").optional(),
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
    if (values.company) return; // honeypot tripped — silently drop

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
        { from_name: values.name, from_email: values.email, message: values.message },
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

  return (
    <section className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <h1 className="font-[--font-display] text-[length:--text-3xl] font-semibold tracking-tight">
        Get in touch
      </h1>
      <p className="mt-2 text-[--color-text-muted]">
        Have a project, role, or question in mind? Send a message directly — no inbox
        middleman.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-5" noValidate>
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            {...register("name")}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className="w-full rounded-[--radius-md] border border-[--color-border] bg-[--color-surface] px-4 py-2.5 text-sm outline-none focus-visible:border-[--color-accent]"
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-xs text-red-500">
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
            className="w-full rounded-[--radius-md] border border-[--color-border] bg-[--color-surface] px-4 py-2.5 text-sm outline-none focus-visible:border-[--color-accent]"
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-xs text-red-500">
              {errors.email.message}
            </p>
          )}
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
            className="w-full rounded-[--radius-md] border border-[--color-border] bg-[--color-surface] px-4 py-2.5 text-sm outline-none focus-visible:border-[--color-accent]"
          />
          {errors.message && (
            <p id="message-error" className="mt-1 text-xs text-red-500">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Honeypot field — hidden from sighted users, but present in the DOM/tab order for bots */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("company")}
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
          aria-hidden="true"
        />

        <button
          type="submit"
          disabled={status === "sending"}
          className="flex items-center justify-center gap-2 rounded-full bg-[--color-accent] px-5 py-2.5 text-sm font-medium text-[--color-accent-contrast] disabled:opacity-60"
        >
          {status === "sending" && <Loader2 size={15} className="animate-spin" />}
          Send message
        </button>

        {status === "sent" && (
          <p className="flex items-center gap-2 text-sm text-[--color-accent-alt]">
            <CheckCircle2 size={15} /> Message sent. Thanks for reaching out.
          </p>
        )}
        {status === "error" && (
          <p className="flex items-center gap-2 text-sm text-red-500">
            <AlertCircle size={15} /> Something went wrong. Try again in a moment.
          </p>
        )}
        {status === "rate-limited" && (
          <p className="flex items-center gap-2 text-sm text-[--color-accent-warn]">
            <AlertCircle size={15} /> Please wait a minute before sending another message.
          </p>
        )}
      </form>
    </section>
  );
}
