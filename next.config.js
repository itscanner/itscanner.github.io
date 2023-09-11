/** @type {import('next').NextConfig} */
const nextConfig = { 
  output: 'export',
  images: {
    loader: 'imgix',
    path: 'canner.imgix.net',
  }
}

module.exports = nextConfig
