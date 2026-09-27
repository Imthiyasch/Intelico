/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["pdf-parse", "mammoth"],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
