/** @type {import('next').NextConfig} */

const { withFederatedSidecar } = require('@module-federation/nextjs-mf');

const mfConfig = {
  name: 'app1',
  filename: 'static/chunks/app1RemoteEntry.js',
  exposes: {
    './Button': './components/Button',
  },
  shared: {
    react: {
      // Notice shared are NOT eager here.
      requiredVersion: false,
      singleton: true,
    },
    'react-dom': {
      requiredVersion: false,
      singleton: true,
    },
  },
};

const nextConfig = {
  future: { webpack5: true },
  reactStrictMode: true,
};

module.exports = withFederatedSidecar(mfConfig)(nextConfig);
