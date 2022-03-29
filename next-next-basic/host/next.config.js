/** @type {import('next').NextConfig} */

const mfConfig = {
  remoteType: 'var',
  remotes: {
    app1: 'app1',
  },
  shared: {
    react: {
      // Notice shared ARE eager here.
      eager: true,
      singleton: true,
      requiredVersion: false,
    },
    'react-dom': {
      eager: true,
      requiredVersion: false,
      singleton: true,
    },
  },
};

const nextConfig = {
  reactStrictMode: true,
  webpack(config, options) {
    config.plugins.push(
      new options.webpack.container.ModuleFederationPlugin(mfConfig),
    );
    return config;
  },
};

module.exports = nextConfig;
