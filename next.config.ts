import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', 
    },
  },
  // Jika kamu menggunakan image dari domain luar (seperti base64 atau localhost), 
  // kadang perlu setting ini, tapi untuk sekarang kita fokus ke payload size.
};

export default nextConfig;