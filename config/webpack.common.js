const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths');

module.exports = {
    context: paths.context,
    entry: {
        'polyfills': './polyfills.js',
        // 'vendor': './vendor.js',
        'app': ['./app/index.js'],
        'style': paths.style
    },

    output: {
        path: paths.build.context, // necessary for HMR to know where to load the hot update chunks
        publicPath: "./",
        filename: '[name].bundle.js',
        chunkFilename: '[id].chunk.js'
    },

    resolve: {
        extensions: ['.js', '.jsx', '.json']
    },

    // configuration regarding modules
    module: {

        // rules for modules (configure loaders, parser options, etc.)
        rules: [

            //JS and JSX with babel
            {
                // these are matching conditions, each accepting a regular expression or string
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    plugins: ['transform-decorators-legacy'],
                    presets: [
                        // webpack understands the native import syntax, and uses it for tree shaking
                        ['es2015', { 'modules': false }],
                        // Specifies what level of language features to activate.
                        // Stage 1 is proposal, Stage 2 is "draft", 4 is finished, 0 is strawman.
                        // See https://tc39.github.io/process-document/
                        'stage-0',
                        'stage-1',
                        // Transpile React components to JavaScript
                        'react'
                    ]
                },
            },

            // HTML
            {
                test: /\.html$/,
                loader: 'html-loader'
            },

            //CSS
            {
                test: /\.s?css$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader'],
                include: paths.style
            },

            // Fonts
            {
                test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                loader: 'file-loader',
                options: {
                    name: paths.fonts
                }
            },

            // Images
            {
                test: /\.(png|jpe?g|gif|svg|ico)$/,
                loader: 'file-loader?name=[path][name].bundle.[ext]',
                options: {
                    name: paths.images
                }
                // include: paths.images
            }
        ]
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['app', 'style', 'polyfills'] // 'vendor', 'polyfills',
        }),

        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),

        // Generate index.html automatically
        new HtmlWebpackPlugin({
            template: paths.html, // 'index.html'
            title: 'ol-wip'
        })
    ]
};
