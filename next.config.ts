import type { NextConfig } from "next";

const apiBaseUrl = new URL(
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5001",
);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: apiBaseUrl.protocol.replace(":", "") as "http" | "https",
        hostname: apiBaseUrl.hostname,
        port: apiBaseUrl.port,
        pathname: "/uploads/**",
      },
    ],
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
