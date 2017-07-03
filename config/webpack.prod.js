const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const paths = require('./paths');

commonConfig.module.rules.find(rule => rule.loader === 'file-loader')
    .options.name = paths.build.fonts;
commonConfig.module.rules.find(rule => rule.loader === 'file-loader?name=[path][name].bundle.[ext]')
    .options.name = paths.build.images;

module.exports = webpackMerge(commonConfig, {
    devtool: 'source-map',

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.LoaderOptionsPlugin({
            htmlLoader: {
                minimize: false
            }
        })
    ]
});
