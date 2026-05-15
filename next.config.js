/** @type {import('next').NextConfig} */
const path = require("path");

const apiUrl = process.env.NEXT_API_URL;

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
  async redirects() {
    const canonicalHost = "www.pepperone.com.br";

    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "pepperone.com.br",
          },
        ],
        destination: `https://${canonicalHost}/:path*`,
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
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Expires",
            value: "Thu, 31 Dec 2037 23:55:55 GMT",
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
    minimumCacheTTL: 31536000,
    remotePatterns: [
      ...(apiRemotePattern ? [apiRemotePattern] : []),
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

module.exports = nextConfig;
