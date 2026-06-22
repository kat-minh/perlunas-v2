// Admin zone (the `admin` app, TailAdmin). Dev: localhost:3001.
// Prod (mfe-deploy): the container hostname http://admin-frontend:3001.
const ADMIN_ZONE_URL = process.env.ADMIN_ZONE_URL ?? "http://localhost:3001";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Self-contained server (.next/standalone) for the mfe-deploy Docker image.
  // On Vercel, let the platform manage the build output.
  output: process.env.VERCEL ? undefined : "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "motion"],
  },
  // ── Multi-Zones: proxy the whole /admin zone to the admin app ───────────
  // The admin sets basePath "/admin", so this single pair of rules covers its
  // pages AND its /admin/_next/* assets. `beforeFiles` runs before this site
  // resolves the path as its own route, so RSC requests (/admin/...?_rsc=)
  // proxy through instead of 404-ing on this site's router.
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/admin", destination: `${ADMIN_ZONE_URL}/admin` },
        { source: "/admin/:path*", destination: `${ADMIN_ZONE_URL}/admin/:path*` },
      ],
    };
  },
};

export default nextConfig;
