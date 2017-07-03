const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const commonConfig = require('./webpack.common.js');
const paths = require('./paths');

// Enable React HMR
commonConfig.entry['app'].unshift('react-hot-loader/patch');
commonConfig.module.rules.find(rule => rule.loader === 'babel-loader')
    .options.plugins.unshift('react-hot-loader/babel');

// Merge dev and common configs
module.exports = webpackMerge(commonConfig, {
    devtool: 'cheap-module-eval-source-map',

    plugins: [
        // Enable named module updates with React HMR
        new webpack.NamedModulesPlugin()
    ],

    devServer: {
        // Publick path folder content will be served from
        publicPath: "/",

        // Enable history API fallback so HTML5 History API based
        // routing works. This is a good default that will come
        // in handy in more complicated setups.
        historyApiFallback: true,

        // Unlike the cli flag, this doesn't set
        // HotModuleReplacementPlugin!
        hot: true,
        inline: true,

        // Display only errors to reduce the amount of output.
        // stats: 'errors-only',
        stats: 'normal',

        host: process.env.HOST || 'localhost',
        port: process.env.PORT || 3001,

        proxy: {
            '/geoserver': { ///GISWMR/*
                target: 'http://localhost:8888/',
                secure: false
            },
            '/GISWMR/*': {
                target: 'http://localhost/',
                secure: false
            },
            '/api/*': {
                target: 'http://localhost:9000/',
                secure: false
            }
            // '/static': {
            //     target: 'https://tile.thunderforest.com/',
            //     secure: false
            // }
        }
    }
});
