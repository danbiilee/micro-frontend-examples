/** @type {import('next').NextConfig} */

const deps = require('./package.json').dependencies;

const mfConfig = {
  remotes: {
    app1: 'app1@http://localhost:3001/app1RemoteEntry.js',
    app2: 'app2@http://localhost:3002/app2RemoteEntry.js',
  },
  shared: {
    react: { singleton: true, requiredVersion: deps['react'], eager: true },
    'react-dom': {
      singleton: true,
      requiredVersion: deps['react-dom'],
      eager: true,
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
