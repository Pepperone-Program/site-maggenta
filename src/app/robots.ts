import { MetadataRoute } from "next";

const siteUrl = "https://www.pepperone.com.br";

export default function robots(): MetadataRoute.Robots {
  const defaultDisallow = ["/api/"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: defaultDisallow,
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "PerplexityBot",
          "ClaudeBot",
          "Claude-User",
          "anthropic-ai",
          "Google-Extended",
        ],
        allow: "/",
        disallow: defaultDisallow,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: defaultDisallow,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
