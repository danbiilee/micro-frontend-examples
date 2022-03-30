const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = webpack.container;
const deps = require('./package.json').dependencies;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isDevelopment = process.env['NODE_ENV'] !== 'production';

const config = {
  entry: './src/index.tsx',
  mode: isDevelopment ? 'development' : 'production',
  devtool: isDevelopment ? 'hidden-source-map' : 'eval',
  devServer: {
    port: 3000,
    liveReload: true,
    watchFiles: [path.resolve(__dirname, 'dist')],
    devMiddleware: {
      writeToDisk: true,
    },
    static: { directory: path.join(__dirname, 'public') },
    historyApiFallback: true,
    compress: true,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
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
            },
          },
        ],
      },
      {
        test: /\.(p|s)?css$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
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
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        app1: 'app1@http://localhost:3001/app1RemoteEntry.js',
        app2: 'app2@http://localhost:3002/app2RemoteEntry.js',
      },
      shared: {
        react: { singleton: true, requiredVersion: deps['react'] },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom'],
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: isDevelopment ? 'development' : 'production',
    }),
    new CleanWebpackPlugin(),
    !isDevelopment && new webpack.LoaderOptionsPlugin({ minimize: true }),
  ].filter(Boolean),
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
  },
};

module.exports = config;
