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
  dotenv.config({ path: '../.env.development' });
} else {
  dotenv.config({ path: '../.env.production' });
}

const {
  MANAGENT_MF_PORT_HOST: port,
  MANAGENT_MF_NAME_HOST: hostName,
  MANAGENT_MF_NAME_APP1: app1Name,
  MANAGENT_MF_URL_APP1: app1URL,
  MANAGENT_MF_NAME_APP2: app2Name,
  MANAGENT_MF_URL_APP2: app2URL,
} = process.env;

// Module Federation's Configuration
const mfConfig = {
  name: hostName,
  remotes: {
    [app1Name]: `${app1Name}@${app1URL}/${app1Name}RemoteEntry.js`,
    [app2Name]: `${app2Name}@${app2URL}/${app2Name}RemoteEntry.js`,
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
  // entry: {
  //   app: {
  //     import: './src/index.tsx',
  //     dependOn: 'react-vendors',
  //   },
  //   'react-vendors': ['react', 'react-dom'],
  // },
  entry: './src/index.tsx',
  mode: isDevelopment ? 'development' : 'production',
  devtool: isDevelopment ? 'eval-cheap-module-source-map' : false,
  devServer: {
    port: parseInt(port),
    hot: true,
    static: { directory: path.join(__dirname, 'public') },
    historyApiFallback: true,
    compress: true,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isDevelopment ? '[name].js' : '[name].[contenthash:8].js',
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
    new webpack.EnvironmentPlugin([
      'NODE_ENV',
      'MANAGENT_MF_NAME_APP1',
      'MANAGENT_MF_NAME_APP2',
    ]),
    new MiniCssExtractPlugin({
      filename: isDevelopment ? '[name].css' : '[name].[contenthash:8].css',
    }),
    isDevelopment &&
      new MFLiveReloadPlugin({
        port: parseInt(port),
        container: hostName,
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
