import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /backend/ = PHP admin + citas.php (servido desde public_html/backend/)
        // /api/     = restos de App Router API routes, no tienen SEO value
        disallow: ["/backend/", "/api/"],
      },
    ],
    sitemap: "https://notaryaplus.com/sitemap.xml",
    host: "https://notaryaplus.com",
  };
}
