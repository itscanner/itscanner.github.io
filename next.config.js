/** @type {import('next').NextConfig} */
// next.config.js

const repo = 'itscanner.github.io'
const assetPrefix = `/${repo}/`
const basePath = `/${repo}`

module.exports = {
  assetPrefix: assetPrefix,
  basePath: basePath,
  images: {
    loader: 'imgix',
    path: 'canner.imgix.net'
  }
}
