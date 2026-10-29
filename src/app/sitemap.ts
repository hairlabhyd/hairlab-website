import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hairlab.one";
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/#shop`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#story`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#herbs`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/#testimonials`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/order-confirmation`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
