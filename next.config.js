const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  basePath: '',
  assetPrefix: '',
  rewrites: async () => [
    {
      source: '/robots.txt',
      destination: '/api/robots.txt',
    },
    {
      source: '/',
      has: [
        {
          type: 'host',
          value: '^(?!.*\\.pagehub\\.co$)(?!pagehub\\.co$).+',
        },
      ],
      destination: '/static/:host',
    },
  ],
  compress: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
        port: '',
        pathname: '/8PYt12v3QMuDRiYrOftNUQ/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Add svg-url-loader for SVG files
    config.module.rules.push({
      test: /\.svg$/,
      use: ['svg-url-loader']
    });

    return config;
  }
});
