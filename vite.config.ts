import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// GitHub Pages serves a root-domain repo (username.github.io) from "/".
// If you rename this to a project-page repo, set VITE_BASE_PATH="/repo-name/"
// in the build environment instead.
export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "apple-touch-icon.png"],
      manifest: {
        name: "Krunal Dey — Software Engineer",
        short_name: "Krunal Dey",
        description:
          "Software engineer building fast, well-crafted products. Projects sync automatically from GitHub.",
        theme_color: "#0A0A0A",
        background_color: "#0A0A0A",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "/icon-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // Don't let the SW intercept /admin -- it's rarely used offline,
        // rarely benefits from stale-while-revalidate, and simplicity there
        // (always hit the network) avoids ever showing a stale admin UI.
        navigateFallbackDenylist: [/^\/admin/],
        runtimeCaching: [
          {
            // The GitHub data snapshot updates every 6h in CI. Network-first
            // means online visitors always get the latest synced data; the
            // cached copy is only a fallback for offline/flaky connections.
            urlPattern: /\/data\/github\.json$/,
            handler: "NetworkFirst",
            options: {
              cacheName: "github-data",
              networkTimeoutSeconds: 4,
              expiration: { maxEntries: 1, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
          {
            urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/,
            handler: "CacheFirst",
            options: {
              cacheName: "firebase-storage-media",
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes("node_modules")) {
            if (id.includes("react-router") || id.includes("/react/") || id.includes("/react-dom/"))
              return "react-vendor";
            if (id.includes("@tanstack/react-query")) return "query-vendor";
            if (id.includes("framer-motion")) return "motion-vendor";
            if (id.includes("firebase")) return "firebase-vendor";
            if (id.includes("fuse.js")) return "search-vendor";
          }
        },
      },
    },
  },
  server: {
    port: 5173,
  },
});
