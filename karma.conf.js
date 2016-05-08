// Karma configuration
// Generated on Sat Dec 19 2015 17:10:29 GMT+0100 (CET)

var webpack = require('webpack');

module.exports = function (config) {
  config.set({
    singleRun: true,
    frameworks: [ 'jasmine' ],
    browsers: [
      'PhantomJS'
    ],
    files: ['tests.webpack.js'],
    preprocessors: {
      'tests.webpack.js': ['webpack'],
      'src/javascripts/**/*.js': ['coverage']
    },
    reporters: ['progress'],
    webpack: {
      babel: {
        presets: ['es2015']
      },
      isparta: {
        embedSource: true,
        noAutoWrap: true,
        babel: {
          presets: ['es2015']
        }
      },
      module: {
        preLoaders: [
          {
            test: /\.js$/,
            exclude: /(app|node_modules)/,
            loaders: ['babel'],
          },
          {
            test: /\.js$/,
            include: /(app)/,
            loaders: ['isparta'],
          },
        ],
      },
      stats: {
        colors: true,
        modules: false,
        reasons: true
      }
    },
    webpackServer: {
      noInfo: true
    }
  });
};