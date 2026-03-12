import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/api/auth/verify-request',
        destination: '/login/verify',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
