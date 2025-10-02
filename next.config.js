const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const { getCdnImageConfig } = require("./utils/cdn");

module.exports = withBundleAnalyzer({
  reactStrictMode: false,
  basePath: "",
  assetPrefix: "",
  // Configure SWC to target modern browsers only (no polyfills/transpiling)
  compiler: {
    emotion: false,
  },
  experimental: {
    // Use browserslist config for build targets
    browsersListForSwc: true,
    // Disable legacy browser support
    legacyBrowsers: false,
  },
  swcMinify: true,
  modularizeImports: {
    'react-icons/tb': {
      transform: 'react-icons/tb/{{member}}',
    },
    'react-icons/si': {
      transform: 'react-icons/si/{{member}}',
    },
    'react-icons/bi': {
      transform: 'react-icons/bi/{{member}}',
    },
    'react-icons/md': {
      transform: 'react-icons/md/{{member}}',
    },
    'react-icons/fa': {
      transform: 'react-icons/fa/{{member}}',
    },
    'react-icons/ai': {
      transform: 'react-icons/ai/{{member}}',
    },
    'react-icons/bs': {
      transform: 'react-icons/bs/{{member}}',
    },
    'react-icons/cg': {
      transform: 'react-icons/cg/{{member}}',
    },
    'react-icons/rx': {
      transform: 'react-icons/rx/{{member}}',
    },
    'react-icons/ri': {
      transform: 'react-icons/ri/{{member}}',
    },
    'react-icons/hi': {
      transform: 'react-icons/hi/{{member}}',
    },
  },
  rewrites: async () => [
    {
      source: "/favicon.ico",
      destination: "/api/favicon",
    },
    {
      source: "/robots.txt",
      destination: "/api/robots.txt",
    },
    {
      source: "/",
      has: [
        {
          type: "host",
          value: "^(?!.*\\.pagehub\\.dev$)(?!pagehub\\.dev$)(?!localhost).+",
        },
      ],
      destination: "/static/:host",
    },
  ],
  async headers() {
    return [
      {
        // Cache static assets for 1 year (immutable)
        source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp|mp4|ttf|otf|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache Next.js static files (JS, CSS) for 1 year
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache static pages with stale-while-revalidate
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // Cache API page responses with ISR strategy
        source: "/api/page/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=60, stale-while-revalidate=300",
          },
        ],
      },
      {
        // Cache media API responses
        source: "/api/media/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
  compress: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      getCdnImageConfig(),
    ],
  },
  webpack: (config, { isServer }) => {
    // Add svg-url-loader for SVG files
    config.module.rules.push({
      test: /\.svg$/,
      use: ["svg-url-loader"],
    });

    return config;
  },
});
