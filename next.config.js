const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const { getCdnImageConfig } = require("./utils/cdn");

module.exports = withBundleAnalyzer({
  reactStrictMode: false,
  basePath: "",
  assetPrefix: "",
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
        // Cache static assets for 1 year
        source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp|mp4|ttf|otf|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache API responses that can be cached
        source: "/api/page/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=60, stale-while-revalidate=300",
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
