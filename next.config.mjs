/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse", "mammoth"],
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
