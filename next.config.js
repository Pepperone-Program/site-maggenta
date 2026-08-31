/** @type {import('next').NextConfig} */
const path = require("path");

const apiUrl = (() => {
  const configured = (process.env.NEXT_API_URL || "").trim().replace(/^['"]|['"]$/g, "");

  if (!configured) {
    throw new Error("NEXT_API_URL deve estar configurada para que o site carregue os dados da API.");
  }

  try {
    const parsed = new URL(configured);

    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      throw new Error("protocolo invalido");
    }

    return parsed.toString().replace(/\/$/, "");
  } catch {
    throw new Error("NEXT_API_URL deve conter uma URL HTTP(S) valida.");
  }
})();
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.maggenta.com.br").replace(
  /\/$/,
  ""
);

const apiRemotePattern = (() => {
  if (!apiUrl) {
    return null;
  }

  try {
    const parsedUrl = new URL(apiUrl);

    return {
      protocol: parsedUrl.protocol.replace(":", ""),
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      pathname: "/**",
    };
  } catch {
    return null;
  }
})();

const nextConfig = {
  compress: true,
  poweredByHeader: false,
  // Metadata must resolve before headers so notFound() can return a real HTTP 404.
  htmlLimitedBots: /.*/,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "maggenta.com.br",
          },
        ],
        destination: `${siteUrl}/:path*`,
        permanent: true,
      },
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    remotePatterns: [
      ...(apiRemotePattern ? [apiRemotePattern] : []),
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "bucket.maggenta.com.br",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "cdn.xbzbrindes.com.br",
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

module.exports = nextConfig;
