const webpack = require('webpack');
const dotenv = require('dotenv');
const { merge } = require('webpack-merge');
const common = require('../../webpack.common');
const { ModuleFederationPlugin } = webpack.container;
const { MFLiveReloadPlugin } = require('@module-federation/fmr');
const deps = require('./package.json').dependencies;

const isDevelopment = process.env.NODE_ENV !== 'production';

// Loads Environment Variables
if (isDevelopment) {
  dotenv.config({ path: '../../.env.development' });
} else {
  dotenv.config({ path: '../../.env.production' });
}

const { MANAGENT_MF_PORT_APP2: port, MANAGENT_MF_NAME_APP2: app2Name } =
  process.env;

// Module Federation's Configuration
const mfConfig = {
  name: app2Name,
  filename: `${app2Name}RemoteEntry.js`,
  exposes: {
    './Button': './src/components/Button2',
  },
  shared: {
    react: { singleton: true, requiredVersion: deps['react'] },
    'react-dom': {
      singleton: true,
      requiredVersion: deps['react-dom'],
    },
  },
};

// Webpack's Configuration
const config = merge(common(port), {
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  plugins: [
    new ModuleFederationPlugin(mfConfig),
    isDevelopment &&
      new MFLiveReloadPlugin({
        port: parseInt(port),
        container: app2Name,
      }),
  ].filter(Boolean),
});

module.exports = config;
