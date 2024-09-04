const { i18n } = require('./next-i18next.config');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: false,
  openAnalyzer: false,
})

/** @type {import("next").NextConfig} */
const nextConfig = {
  basePath:
    '' === process.env.NEXT_PUBLIC_PATH
      ? undefined
      : '/' + process.env.NEXT_PUBLIC_PATH,
  reactStrictMode: false, // se desactiva porque React 18 renderiza y llama useEffect 2 veces 🤷‍♂️
  poweredByHeader: false,

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.child_process = false
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }

    return config
  },
  output: 'standalone',
  i18n,
  eslint: {
    dirs: ['common', 'context', 'modules', 'pages', 'themes'],
  },
}

module.exports = withBundleAnalyzer(nextConfig)
