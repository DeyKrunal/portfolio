import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/layout/RootLayout";
import { PageLoader } from "@/components/common/PageLoader";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ProtectedRoute } from "@/features/admin/components/ProtectedRoute";

// --- Public pages ---
const HomePage = lazy(() => import("@/pages/HomePage").then((m) => ({ default: m.HomePage })));
const ProjectsPage = lazy(() =>
  import("@/pages/ProjectsPage").then((m) => ({ default: m.ProjectsPage }))
);
const ProjectDetailPage = lazy(() =>
  import("@/pages/ProjectDetailPage").then((m) => ({ default: m.ProjectDetailPage }))
);
const AboutPage = lazy(() => import("@/pages/AboutPage").then((m) => ({ default: m.AboutPage })));
const ExperiencePage = lazy(() =>
  import("@/pages/ExperiencePage").then((m) => ({ default: m.ExperiencePage }))
);
const EducationPage = lazy(() =>
  import("@/pages/EducationPage").then((m) => ({ default: m.EducationPage }))
);
const SkillsPage = lazy(() => import("@/pages/SkillsPage").then((m) => ({ default: m.SkillsPage })));
const CertificatesPage = lazy(() =>
  import("@/pages/CertificatesPage").then((m) => ({ default: m.CertificatesPage }))
);
const AchievementsPage = lazy(() =>
  import("@/pages/AchievementsPage").then((m) => ({ default: m.AchievementsPage }))
);
const GalleryPage = lazy(() =>
  import("@/pages/GalleryPage").then((m) => ({ default: m.GalleryPage }))
);
const TestimonialsPage = lazy(() =>
  import("@/pages/TestimonialsPage").then((m) => ({ default: m.TestimonialsPage }))
);
const ResumePage = lazy(() => import("@/pages/ResumePage").then((m) => ({ default: m.ResumePage })));
const NowPlayingPage = lazy(() =>
  import("@/pages/NowPlayingPage").then((m) => ({ default: m.NowPlayingPage }))
);
const GithubAnalyticsPage = lazy(() =>
  import("@/pages/GithubAnalyticsPage").then((m) => ({ default: m.GithubAnalyticsPage }))
);
const BlogPage = lazy(() => import("@/pages/BlogPage").then((m) => ({ default: m.BlogPage })));
const BlogPostPage = lazy(() =>
  import("@/pages/BlogPostPage").then((m) => ({ default: m.BlogPostPage }))
);
const ContactPage = lazy(() =>
  import("@/pages/ContactPage").then((m) => ({ default: m.ContactPage }))
);
const PrivacyPage = lazy(() =>
  import("@/pages/PrivacyPage").then((m) => ({ default: m.PrivacyPage }))
);
const TermsPage = lazy(() => import("@/pages/TermsPage").then((m) => ({ default: m.TermsPage })));
const ChangelogPage = lazy(() =>
  import("@/pages/ChangelogPage").then((m) => ({ default: m.ChangelogPage }))
);

// --- Admin pages ---
const AdminLoginPage = lazy(() =>
  import("@/features/admin/pages/AdminLoginPage").then((m) => ({ default: m.AdminLoginPage }))
);
const AdminLayout = lazy(() =>
  import("@/features/admin/components/AdminLayout").then((m) => ({ default: m.AdminLayout }))
);
const AdminOverviewPage = lazy(() =>
  import("@/features/admin/pages/AdminOverviewPage").then((m) => ({ default: m.AdminOverviewPage }))
);
const AdminExperiencePage = lazy(() =>
  import("@/features/admin/pages/AdminExperiencePage").then((m) => ({ default: m.AdminExperiencePage }))
);
const AdminEducationPage = lazy(() =>
  import("@/features/admin/pages/AdminEducationPage").then((m) => ({ default: m.AdminEducationPage }))
);
const AdminSkillsPage = lazy(() =>
  import("@/features/admin/pages/AdminSkillsPage").then((m) => ({ default: m.AdminSkillsPage }))
);
const AdminCertificatesPage = lazy(() =>
  import("@/features/admin/pages/AdminCertificatesPage").then((m) => ({
    default: m.AdminCertificatesPage,
  }))
);
const AdminAchievementsPage = lazy(() =>
  import("@/features/admin/pages/AdminAchievementsPage").then((m) => ({
    default: m.AdminAchievementsPage,
  }))
);
const AdminGalleryPage = lazy(() =>
  import("@/features/admin/pages/AdminGalleryPage").then((m) => ({ default: m.AdminGalleryPage }))
);
const AdminTestimonialsPage = lazy(() =>
  import("@/features/admin/pages/AdminTestimonialsPage").then((m) => ({
    default: m.AdminTestimonialsPage,
  }))
);
const AdminBlogPage = lazy(() =>
  import("@/features/admin/pages/AdminBlogPage").then((m) => ({ default: m.AdminBlogPage }))
);
const AdminMediaLibraryPage = lazy(() =>
  import("@/features/admin/pages/AdminMediaLibraryPage").then((m) => ({
    default: m.AdminMediaLibraryPage,
  }))
);
const AdminSettingsPage = lazy(() =>
  import("@/features/admin/pages/AdminSettingsPage").then((m) => ({ default: m.AdminSettingsPage }))
);

function withSuspense(Component: React.LazyExoticComponent<() => React.JSX.Element | null>) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: "/", element: withSuspense(HomePage) },
      { path: "/projects", element: withSuspense(ProjectsPage) },
      { path: "/projects/:name", element: withSuspense(ProjectDetailPage) },
      { path: "/about", element: withSuspense(AboutPage) },
      { path: "/experience", element: withSuspense(ExperiencePage) },
      { path: "/education", element: withSuspense(EducationPage) },
      { path: "/skills", element: withSuspense(SkillsPage) },
      { path: "/certificates", element: withSuspense(CertificatesPage) },
      { path: "/achievements", element: withSuspense(AchievementsPage) },
      { path: "/gallery", element: withSuspense(GalleryPage) },
      { path: "/testimonials", element: withSuspense(TestimonialsPage) },
      { path: "/resume", element: withSuspense(ResumePage) },
      { path: "/now-playing", element: withSuspense(NowPlayingPage) },
      { path: "/analytics", element: withSuspense(GithubAnalyticsPage) },
      { path: "/blog", element: withSuspense(BlogPage) },
      { path: "/blog/:slug", element: withSuspense(BlogPostPage) },
      { path: "/contact", element: withSuspense(ContactPage) },
      { path: "/privacy", element: withSuspense(PrivacyPage) },
      { path: "/terms", element: withSuspense(TermsPage) },
      { path: "/changelog", element: withSuspense(ChangelogPage) },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  { path: "/admin/login", element: withSuspense(AdminLoginPage) },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/admin",
        element: withSuspense(AdminLayout),
        children: [
          { index: true, element: withSuspense(AdminOverviewPage) },
          { path: "experience", element: withSuspense(AdminExperiencePage) },
          { path: "education", element: withSuspense(AdminEducationPage) },
          { path: "skills", element: withSuspense(AdminSkillsPage) },
          { path: "certificates", element: withSuspense(AdminCertificatesPage) },
          { path: "achievements", element: withSuspense(AdminAchievementsPage) },
          { path: "gallery", element: withSuspense(AdminGalleryPage) },
          { path: "testimonials", element: withSuspense(AdminTestimonialsPage) },
          { path: "blog", element: withSuspense(AdminBlogPage) },
          { path: "media", element: withSuspense(AdminMediaLibraryPage) },
          { path: "settings", element: withSuspense(AdminSettingsPage) },
        ],
      },
    ],
  },
]);
