/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "alpha-pay-assets-staging.s3.ap-southeast-1.amazonaws.com",
      },
    ],
  }
};

export default nextConfig;
