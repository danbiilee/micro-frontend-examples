const webpack = require('webpack');
const dotenv = require('dotenv');
const { merge } = require('webpack-merge');
const common = require('../webpack.common');
const { ModuleFederationPlugin } = webpack.container;
const { MFLiveReloadPlugin } = require('@module-federation/fmr');
const deps = require('./package.json').dependencies;

const isDevelopment = process.env.NODE_ENV !== 'production';

// Loads Environment Variables
if (isDevelopment) {
  dotenv.config({ path: '../.env.development' });
} else {
  dotenv.config({ path: '../.env.production' });
}

const { MANAGENT_MF_PORT_HOST: port, MANAGENT_MF_NAME_HOST: hostName } =
  process.env;

// Module Federation's Configuration
const mfConfig = {
  name: hostName,
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
  plugins: [
    new webpack.EnvironmentPlugin([
      'NODE_ENV',
      'MANAGENT_MF_NAME_APP1',
      'MANAGENT_MF_NAME_APP2',
      'MANAGENT_MF_URL_APP1',
      'MANAGENT_MF_URL_APP2',
    ]),
    new ModuleFederationPlugin(mfConfig),
    isDevelopment &&
      new MFLiveReloadPlugin({
        port: parseInt(port),
        container: hostName,
      }),
  ].filter(Boolean),
});

module.exports = config;
