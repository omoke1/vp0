const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Suppress source map warnings
      webpackConfig.ignoreWarnings = [
        /Failed to parse source map/,
        /ENOENT: no such file or directory/,
      ];

      // Optimize bundle splitting
      webpackConfig.optimization = {
        ...webpackConfig.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: -10,
              chunks: 'all',
            },
            web3modal: {
              test: /[\\/]node_modules[\\/]@web3modal[\\/]/,
              name: 'web3modal',
              priority: 20,
              chunks: 'all',
            },
            wagmi: {
              test: /[\\/]node_modules[\\/](wagmi|viem|@wagmi)[\\/]/,
              name: 'wagmi',
              priority: 20,
              chunks: 'all',
            },
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              priority: 20,
              chunks: 'all',
            },
            framer: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: 'framer',
              priority: 15,
              chunks: 'all',
            },
            query: {
              test: /[\\/]node_modules[\\/]@tanstack[\\/]/,
              name: 'query',
              priority: 15,
              chunks: 'all',
            },
          },
        },
      };

      // Resolve configuration for better tree shaking
      webpackConfig.resolve = {
        ...webpackConfig.resolve,
        fallback: {
          ...webpackConfig.resolve.fallback,
          "crypto": false,
          "stream": false,
          "util": false,
        },
        alias: {
          ...webpackConfig.resolve.alias,
          '@react-native-async-storage/async-storage': false,
        },
      };

      return webpackConfig;
    },
  },
};
