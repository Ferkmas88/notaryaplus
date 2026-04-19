import type { MetadataRoute } from "next";

const BASE_URL = "https://notaryaplus.com";

// Fecha fija en build-time. Static export no ejecuta en runtime,
// así que `new Date()` aquí se congela al momento del build.
// Es intencional: cada deploy actualiza lastModified.
const LAST_MODIFIED = new Date();

type Route = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

const ROUTES: Route[] = [
  { path: "",               priority: 1.0, changeFrequency: "weekly"  },
  { path: "/servicios",     priority: 0.8, changeFrequency: "monthly" },
  { path: "/taxes",         priority: 0.9, changeFrequency: "monthly" },
  { path: "/notaria",       priority: 0.8, changeFrequency: "monthly" },
  { path: "/inmigracion",   priority: 0.8, changeFrequency: "monthly" },
  { path: "/negocios",      priority: 0.7, changeFrequency: "monthly" },
  { path: "/traducciones",  priority: 0.7, changeFrequency: "monthly" },
  { path: "/contabilidad",  priority: 0.7, changeFrequency: "monthly" },
  { path: "/citas",         priority: 0.9, changeFrequency: "monthly" },
  { path: "/contacto",      priority: 0.8, changeFrequency: "monthly" },
  { path: "/privacy",       priority: 0.3, changeFrequency: "yearly"  },
  { path: "/terms",         priority: 0.3, changeFrequency: "yearly"  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: LAST_MODIFIED,
    changeFrequency,
    priority,
  }));
}
