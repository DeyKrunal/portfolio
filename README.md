# Krunal Dey — Portfolio Platform 

A developer portfolio that syncs itself from GitHub. Projects, languages, stars,
READMEs, and contribution stats are fetched by a scheduled GitHub Action and
shipped as a static JSON snapshot — you never add a project by hand. Everything
that can't come from GitHub (certificates, experience, blog, gallery,
testimonials) is managed from an Admin Dashboard backed by Firebase, and the
whole site still builds to static files servable from GitHub Pages.

## Status: Phase 4 of 4 (Complete)

This repo was built in phases so each layer was real, typechecked, and tested
before the next one landed — not a wall of generated files that looked
complete but were never run.

| Phase | Scope | Status |
|---|---|---|
| 1 | Scaffold, design tokens, routing/layout, GitHub data pipeline, SEO/sitemap, CI/CD | Done |
| 2 | Full public site: Skills, Education, Certificates, Achievements, Gallery, Testimonials, Resume, Now Playing, GitHub Analytics dashboard, per-page SEO, Privacy/Terms/Changelog | Done |
| 3 | Admin Dashboard: Firebase Auth, CRUD for every content type, media library, settings | Done |
| 4 | Blog post rendering (sanitized), global command palette, PWA support, animation polish, performance/accessibility pass | Done (this repo) |

**What's new in this phase:**

- **Individual blog post pages** (`/blog/:slug`) — Markdown is parsed with
  `marked` and sanitized with DOMPurify before rendering to visitors. This is
  a genuinely different trust boundary than the admin editor's own live
  preview (`MarkdownPreview.tsx`, admin-only, never shown to visitors) —
  see the comments in `SanitizedMarkdown.tsx` for why both exist. Drafts and
  unknown slugs both redirect to `/blog`, so visitors can't distinguish
  "doesn't exist" from "not published yet" by probing URLs.
- **Global command palette** (Ctrl/Cmd+K, or the Search button in the header)
  — fuzzy search across static pages, GitHub projects, blog posts, skills,
  certificates, and testimonials, with keyboard navigation. It's built as a
  lazy-loaded component behind a tiny always-mounted trigger specifically so
  Fuse.js and Firebase never load until someone actually opens search — the
  home page doesn't pay for a feature it isn't using.
- **PWA support** — installable (manifest + icons), with a service worker
  that precaches the app shell and uses a network-first strategy for the
  GitHub data snapshot (so online visitors always get the freshest sync;
  offline visitors get the last cached one).
- **Animation polish** — a subtle route-change fade, done with a small
  CSS-only component rather than Framer Motion, specifically to avoid
  pulling the ~130KB motion vendor chunk into every page's critical path
  (Framer Motion is still used, lazily, on the Home page hero).
- **Small real fixes made along the way, not just new features**: the
  previously-fetched-but-never-shown per-repo GitHub OG image now renders as
  a hero banner on the project detail page; a blog cover image was missing a
  fixed aspect ratio (CLS risk) and now has one; a couple of `preconnect`
  hints were added for the external domains actually used at runtime
  (Firestore, Firebase Storage, GitHub's OG image endpoint).

**Honest scope limits, stated plainly:**

- **No Lighthouse score is claimed here.** This container has no Chrome/
  browser to run Lighthouse in, so instead of fabricating a "100/100/100/100"
  claim, this phase did a manual pass: verified every image has real `alt`
  text, checked for layout-shift risks, confirmed route-level code splitting
  keeps the main entry chunk small (~61KB gzip ~20KB; Firebase, Recharts, and
  Framer Motion all stay in separate chunks loaded only where needed), and
  added `preconnect` hints. **Run Lighthouse yourself once deployed** (Chrome
  DevTools → Lighthouse, or `npx unlighthouse --site https://your-site`) and
  treat any gap as a follow-up, not a broken promise.
- **The command palette's project/blog results depend on data already being
  loaded.** The GitHub snapshot loads immediately when the palette opens
  (same static JSON as everywhere else); Firestore collections (blog, skills,
  certificates, testimonials) also fetch fresh on open. On a slow connection
  there's a brief moment where only static pages are searchable — this is a
  real tradeoff for keeping those dependencies out of the main bundle, not an
  oversight.
- **Sitemap and RSS now include individual blog posts, via an optional
  Firestore export.** `scripts/export-blog-index.mjs` reads published posts
  from Firestore using `firebase-admin` and a service account (a separate
  credential from the client-side `VITE_FIREBASE_*` config — a service
  account bypasses security rules entirely, so it's used only in this
  build-time script, never shipped to the browser). Without the
  `FIREBASE_SERVICE_ACCOUNT_KEY` secret set, this step degrades gracefully:
  it logs a note and writes an empty index rather than failing the build, so
  forks and first-time setups keep working — sitemap/RSS just cover static
  routes until the secret is added. See "Exporting blog posts for
  sitemap/RSS" below for setup.
- **Footer social links are wired to Firestore for real now** — but not via
  the Firebase SDK. Because the Footer is part of the always-mounted
  `RootLayout` (not a lazy route), importing the SDK there would have pulled
  the ~600KB firebase-vendor chunk into every single page's load, undoing
  the route-splitting from earlier phases. Instead, `useSocialLinks` reads
  the public `settings/social` document via a plain `fetch()` to the
  Firestore REST API (`services/firestoreRest.ts`) — Firestore's REST
  endpoint honors the same security rules, and reads on that document are
  already public (`allow read: if true`), so no auth token is needed. Zero
  added bundle weight, real data.

---

## Quick start

```bash
npm install
cp .env.example .env      # fill in Firebase + EmailJS values (see below)
npm run fetch:github      # requires GH_TOKEN in your shell or .env
npm run dev
```

## Architecture

```
src/
  components/
    ui/          shadcn-style primitives, theme toggle, brand icons
    layout/      Header, Footer, RootLayout
    common/      RepoCard, EmptyState, skeletons -- shared across pages
  pages/         one file per route
  hooks/         useGithub (static snapshot), useFirestoreCollection
  services/      github.ts -- fetches the static JSON snapshot
  providers/     ThemeProvider, QueryProvider
  config/        site.ts -- single source of truth for nav/socials/username
  types/         github.ts, content.ts -- all data shapes
  lib/           cn.ts (Tailwind merge), firebase.ts (client init)
  styles/        index.css -- full design token system
scripts/
  fetch-github-data.mjs   the GitHub sync pipeline (GraphQL + REST)
  generate-seo.mjs        sitemap.xml / rss.xml / robots.txt after build
.github/workflows/
  sync-github-data.yml    runs the fetch script every 6h, commits the JSON
  deploy.yml              lint -> typecheck -> test -> build -> seo -> deploy
firestore.rules / storage.rules   the real security boundary (see below)
```

### Why GitHub data is a static JSON file, not a live API call

The site never calls the GitHub API from the browser. Two hard constraints
rule that out: (1) an authenticated token can't be shipped in client code
without exposing it to anyone who opens devtools, and (2) unauthenticated
requests are capped at 60/hour, which a single visitor refreshing the page a
few times could exhaust. Instead, `scripts/fetch-github-data.mjs` runs in
GitHub Actions (which gets `secrets.GITHUB_TOKEN` for free, no setup needed)
every 6 hours, and commits `public/data/github.json`. The site reads that file
like any other static asset. This is also just faster for visitors -- no
GraphQL round trip, no rate-limit risk, ever.

### Why Firebase config in the client isn't a security hole (but rules are)

The `VITE_FIREBASE_*` values are safe to ship in a bundle -- they identify
which Firebase project to talk to, not a secret credential. The actual
access control lives in `firestore.rules` and `storage.rules`: public reads
are allowed on content collections, but writes require `request.auth.token.email`
to match your admin address. Update the email in both `firestore.rules` and
`storage.rules` (and `VITE_ADMIN_EMAILS` for the UI-side check) before you
deploy rules -- the placeholder `you@example.com` grants no one access.

### Honest limits of a backend-less static site

A few items in typical "enterprise checklist" requirements don't have a real
analog without a server, and this repo doesn't pretend otherwise:

- **CSRF protection** is a server-session concept; there's no session here.
  Firestore/Storage rules are the actual boundary.
- **Contact form rate limiting** is client-side only (a `localStorage`
  cool-down) -- trivially bypassed by anyone motivated, but it stops casual
  double-submits and basic scripted spam. Real protection would need a Cloud
  Function or a form service with server-side throttling.
- **Blog RSS feed** currently ships empty. Posts live in Firestore, and this
  build has no server step that can read Firestore at Action-run time without
  extra service-account setup. Phase 3 will either export published posts to
  JSON in the same CI job as the GitHub sync, or add a small Cloud Function
  that regenerates `rss.xml` on publish.

---

## Admin Dashboard

Once Firebase is set up (see below) and your email is in both
`VITE_ADMIN_EMAILS` and the `isAdmin()` allow-list in `firestore.rules` /
`storage.rules`:

1. Go to `/admin` (or click "Sign in" -- there's no public link to it by
   design; it's reachable directly by URL).
2. Sign in with the Google account matching your allow-listed email.
3. You'll land on the Dashboard overview, showing content counts per section
   and the current GitHub sync status.
4. Each content type (Experience, Education, Skills, Certificates,
   Achievements, Gallery, Testimonials) has the same pattern: a list with
   up/down reordering, an "Add" button that opens a slide-over form, and
   edit/delete actions per row.
5. Blog has its own editor: title, auto-generated (editable) slug, excerpt,
   cover image, tags, a Markdown textarea with a "Preview" toggle, and a
   draft/published status switch.
6. Media Library lets you drag-and-drop images or PDFs directly to Storage,
   then copy the resulting URL to paste into any image field or the Resume
   settings tab.
7. Settings holds Personal info, Social links, Resume URL, and Now Playing.
8. Every image/file field (Certificates, Gallery, Resume, testimonial
   photos, etc.) has an **Upload / Paste URL** toggle. "Upload" goes to
   Firebase Storage as before. "Paste URL" lets you point at a file
   committed directly to this repo's `public/` folder instead (e.g.
   `public/documents/resume.pdf` → paste `/documents/resume.pdf`) — no
   Storage, no Blaze plan, just `git push`. This trades instant updates
   (Storage) for zero-cost, version-controlled files that only change on
   deploy — a good fit for a resume or a couple of static certificates that
   rarely change, less good for a gallery you update often.

**Why the client-side admin check isn't the real security boundary:** the
`ProtectedRoute` component (and the `useAuth` hook's `isAdmin` check) only
decide what your own browser renders. Firestore and Storage independently
verify `request.auth.token.email` against the same allow-list on every
read/write, server-side. Someone could theoretically load `/admin` HTML/JS
without being on the list; they still couldn't write a single document,
because Firestore would reject it. This is why keeping `firestore.rules` and
`storage.rules` in sync with `VITE_ADMIN_EMAILS` -- and actually deploying
those rules -- matters more than anything in the React code.

## Exporting blog posts for sitemap/RSS

This step is optional — the site works fully without it, just with a smaller
sitemap and an empty RSS feed.

1. Firebase Console → Project settings → **Service accounts** → "Generate
   new private key". This downloads a JSON file — treat it like a password;
   it bypasses Firestore security rules entirely.
2. Base64-encode it:
   ```bash
   base64 -i service-account.json | tr -d '\n'
   ```
3. Add the result as a repo secret named `FIREBASE_SERVICE_ACCOUNT_KEY`
   (Settings → Secrets and variables → Actions).
4. That's it — `deploy.yml` already runs `npm run export:blog` before the
   build and feeds the result into `generate:seo`. Locally, you can run
   `FIREBASE_SERVICE_ACCOUNT_KEY=<base64> npm run export:blog` the same way.

**Why this needs a different credential than the rest of the app**: every
other Firebase-touching feature in this repo (the Admin Dashboard, the
Footer's social links) reads through either the client SDK gated by
`firestore.rules`, or a plain public REST read on a document your rules
already allow anyone to read. A service account is different — it's issued
server-side authority that ignores security rules to let CI read *all*
Firestore data, including unpublished drafts (this script filters those out
itself, in the query). That's necessary to build a sitemap, but it also
means this key must never end up in client-side code or a public repo
secret; keep it in GitHub Actions secrets only.

## Firebase setup (from scratch)

1. Go to the Firebase Console (console.firebase.google.com), create a project.
2. **Build -> Authentication -> Sign-in method** -> enable Google.
3. **Build -> Firestore Database** -> create in production mode.
4. **Build -> Storage** -> create a bucket.
5. **Project settings -> General -> Your apps** -> add a Web app -> copy the
   config values into `.env` as `VITE_FIREBASE_*`.
6. Install the Firebase CLI and deploy rules:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use --add          # select your project
   firebase deploy --only firestore:rules,storage
   ```
7. Add your real email to the `isAdmin()` allow-list in **both**
   `firestore.rules` and `storage.rules`, then redeploy rules.

## GitHub token setup

`scripts/fetch-github-data.mjs` needs a token with read access to your public
repos.

- **In CI**: nothing to do -- `secrets.GITHUB_TOKEN` is provided automatically
  by GitHub Actions and already wired into `sync-github-data.yml`.
- **Locally**: create a fine-grained personal access token (github.com/settings/tokens?type=beta)
  with "Public Repositories (read-only)" access, put it in `.env` as `GH_TOKEN`.

## GitHub Pages deployment

1. Repo **Settings -> Pages -> Source** -> "GitHub Actions".
2. Repo **Settings -> Secrets and variables -> Actions** -> add all the
   `VITE_FIREBASE_*`, `VITE_ADMIN_EMAILS`, and `VITE_EMAILJS_*` secrets listed
   in `.env.example`.
3. Push to `main` -- `deploy.yml` lints, typechecks, tests, builds, generates
   SEO files, and publishes to Pages automatically.
4. `sync-github-data.yml` runs every 6 hours (and on every push) to keep
   `public/data/github.json` current.

Because this repo is named `DeyKrunal.github.io`, it's a root-domain Pages
site (`base: "/"` in `vite.config.ts`). If you ever rename it to a
project-page repo, set `VITE_BASE_PATH=/repo-name/` in the build environment
instead.

## Available scripts

| Command | What it does |
|---|---|
| `npm run dev` | local dev server |
| `npm run build` | typecheck + production build |
| `npm run typecheck` | `tsc -b --noEmit` |
| `npm run lint` | oxlint |
| `npm run test` | vitest |
| `npm run fetch:github` | run the GitHub sync locally |
| `npm run export:blog` | export published blog posts from Firestore for sitemap/RSS (needs `FIREBASE_SERVICE_ACCOUNT_KEY`) |
| `npm run generate:seo` | regenerate sitemap/RSS/robots into `dist/` (run after build) |

## Troubleshooting / FAQ

**"GitHub data hasn't synced yet" banner on the home page** -- `public/data/github.json`
doesn't exist yet. Run `npm run fetch:github` locally (needs `GH_TOKEN`), or
push to `main` and let `sync-github-data.yml` run once.

**Experience / Education / Skills / Certificates / Achievements / Gallery /
Testimonials / Blog / Resume / Now Playing show an empty state** -- these are
all Firestore-backed and there's no Admin Dashboard yet (Phase 3) to add
entries through the UI. You can add documents directly in the Firebase
Console in the meantime -- see `src/types/content.ts` for the exact shape
each collection/document needs (`experience`, `education`, `skills`,
`certificates`, `achievements`, `gallery`, `testimonials`, `blogPosts`
collections; `settings/resume` and `settings/nowPlaying` documents).

**Contact form silently does nothing on submit** -- `VITE_EMAILJS_*` env vars
aren't set. Create a free account at emailjs.com, connect an email service,
and fill in the three values in `.env`.
