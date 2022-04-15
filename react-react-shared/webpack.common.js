const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

// Webpack's Configuration
const config = (dirname, port) => {
  return {
    entry: './src/index.tsx',
    mode: isDevelopment ? 'development' : 'production',
    devtool: isDevelopment ? 'eval-cheap-module-source-map' : false,
    devServer: {
      port: parseInt(port),
      hot: true,
      static: { directory: path.join(dirname, 'public') },
      historyApiFallback: true,
      compress: true,
    },
    output: {
      path: path.resolve(dirname, 'dist'),
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
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
          ].filter(Boolean),
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
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
      isDevelopment && new ReactRefreshWebpackPlugin(),
      !isDevelopment &&
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash:8].css',
        }),
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
};

module.exports = config;
