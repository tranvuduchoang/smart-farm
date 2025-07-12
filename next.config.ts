import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Add valid experimental options here if needed
  },
  images: {
    domains: ['images.unsplash.com'],  // Thêm domain này để chấp nhận hình ảnh từ Unsplash
  },
};

export default nextConfig;
