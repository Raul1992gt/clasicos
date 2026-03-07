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
  eslint: {
    // Ignorar los warnings de ESLint durante el build de producción
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
