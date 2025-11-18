import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "uploadthing.com",
      "utfs.io",
      "img.clerk.com",
      "subdomain",
      "files.stripe.com",
      "9g93hslwju.ufs.sh"
    ],
  },
  reactStrictMode: false
};

export default nextConfig;
