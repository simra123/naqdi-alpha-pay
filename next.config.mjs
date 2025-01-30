/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    domains: ["alpha-pay-assets-staging.s3.ap-southeast-1.amazonaws.com"],
  },
};

export default nextConfig;
