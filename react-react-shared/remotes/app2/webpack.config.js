const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
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
const config = {
  entry: './src/index.tsx',
  mode: isDevelopment ? 'development' : 'production',
  devtool: isDevelopment ? 'eval-cheap-module-source-map' : false,
  devServer: {
    port: parseInt(port),
    hot: true,
    static: { directory: path.join(__dirname, 'public') },
    historyApiFallback: true,
    compress: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'assets/[contenthash:8][ext][query]',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: { browsers: ['last 2 chrome versions'] },
                    debug: isDevelopment,
                  },
                ],
                '@babel/preset-react',
                '@babel/preset-typescript',
              ],
              plugins: [
                isDevelopment && require.resolve('react-refresh/babel'),
              ].filter(Boolean),
            },
          },
        ],
      },
      {
        test: /\.(p|s)?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(svg|png|jpe?g|gif|ico)$/i,
        type: 'asset/resource',
      },
      {
        test: /.(woff2?|eot|(o|t)tf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    alias: {},
  },
  plugins: [
    new ModuleFederationPlugin(mfConfig),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: isDevelopment ? '[name].css' : '[name].[contenthash:8].css',
    }),
    isDevelopment &&
      new MFLiveReloadPlugin({
        port: parseInt(port),
        container: app2Name,
      }),
    isDevelopment && new ReactRefreshWebpackPlugin(),
    !isDevelopment && new webpack.LoaderOptionsPlugin({ minimize: true }),
    !isDevelopment &&
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: `report_${Date.now()}.html`,
        openAnalyzer: false,
      }),
  ].filter(Boolean),
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ],
    splitChunks: {},
  },
};

module.exports = config;
