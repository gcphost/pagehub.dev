const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const { getCdnImageConfig } = require("./utils/cdn");

module.exports = withBundleAnalyzer({
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
          value: "^(?!.*\\.pagehub\\.dev$)(?!pagehub\\.dev$).+",
        },
      ],
      destination: "/static/:host",
    },
  ],
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
