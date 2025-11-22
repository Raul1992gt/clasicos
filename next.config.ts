import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https', 
        hostname: '7mu9nlsax4tf5jah.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;
