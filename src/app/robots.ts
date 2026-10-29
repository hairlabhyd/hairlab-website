import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/order-confirmation"],
    },
    sitemap: "https://hairlab.one/sitemap.xml",
    host: "https://hairlab.one",
  };
}
