import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, AlertCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/features/admin/hooks/useAuth";
import { firebaseEnabled } from "@/lib/firebase";

export function AdminLoginPage() {
  const { user, isAdmin, loading, signInWithGoogle, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user && isAdmin) {
      const from = (location.state as { from?: Location })?.from?.pathname ?? "/admin";
      navigate(from, { replace: true });
    }
  }, [loading, user, isAdmin, navigate, location.state]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[--color-bg] px-4">
      <div className="w-full max-w-sm rounded-[--radius-lg] border border-[--color-border] bg-[--color-surface] p-8 text-center shadow-[--shadow-md]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[--color-accent]/10">
          <ShieldCheck size={22} className="text-[--color-accent]" />
        </div>
        <h1 className="mt-4 font-[--font-display] text-lg font-semibold">Admin access</h1>
        <p className="mt-1.5 text-sm text-[--color-text-muted]">
          Sign in with the Google account authorized to manage this site.
        </p>

        {!firebaseEnabled && (
          <p className="mt-6 flex items-start gap-2 rounded-[--radius-md] border border-[--color-accent-warn]/30 bg-[--color-accent-warn]/5 px-3 py-2.5 text-left text-xs text-[--color-accent-warn]">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            Firebase isn't configured. Set the <code>VITE_FIREBASE_*</code> env vars, then reload.
          </p>
        )}

        {user && !isAdmin && (
          <p className="mt-6 flex items-start gap-2 rounded-[--radius-md] border border-[--color-accent-warn]/30 bg-[--color-accent-warn]/5 px-3 py-2.5 text-left text-xs text-[--color-accent-warn]">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            Signed in as {user.email}, but that address isn't on the admin allow-list
            (<code>VITE_ADMIN_EMAILS</code>).
          </p>
        )}

        {error && (
          <p className="mt-4 text-xs text-red-500">{error}</p>
        )}

        <button
          type="button"
          onClick={signInWithGoogle}
          disabled={!firebaseEnabled}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-[--color-border] bg-[--color-bg-subtle] px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[--color-border] disabled:opacity-50"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <a
          href="/portfolio/"
          className="mt-6 inline-flex items-center gap-1 text-xs text-[--color-text-faint] hover:text-[--color-text]"
        >
          <ArrowLeft size={12} /> Back to site
        </a>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.28-1.93-6.15-4.52H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.85 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.35-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.95l3.67-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.67 2.84C6.72 7.3 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
