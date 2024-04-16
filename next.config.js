const path = require('path')

/** @type {import('next').NextConfig} */
module.exports = {
  trailingSlash: true,
  reactStrictMode: false,
  experimental: {
    esmExternals: false,
    jsconfigPaths: true, // enables it for both jsconfig.json and tsconfig.json
    serverActions: true,
  },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  }
}
