/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/webapp' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/webapp/' : '',
}

module.exports = nextConfig
