import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      }
    ]
  },
  // Enable standalone output for Docker deployments
  output: process.env.NODE_ENV === "production" ? "standalone" : undefined,
};

export default nextConfig;
