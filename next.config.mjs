/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export',
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/v0-pharmacy-e-commerce-site' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/v0-pharmacy-e-commerce-site/' : '',
}

export default nextConfig