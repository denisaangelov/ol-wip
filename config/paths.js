const helpers = require('./helpers');

module.exports = {
    root: helpers.root('/'),
    context: helpers.root('src'),
    index: helpers.root('src/app/index.js'),
    html: helpers.root('src/index.html'),
    style: [
        helpers.root('node_modules/bootstrap/dist/css/', 'bootstrap.min.css'),
        helpers.root('node_modules/font-awesome/css/', 'font-awesome.min.css'),
        helpers.root('node_modules/openlayers/css/', 'ol.css'),
        helpers.root('src/app/assets/style/', 'map.scss')
    ],
    fonts: 'assets/fonts/[name].bundle.[ext]',
    images: 'assets/images/[name].bundle.[ext]',
    build: {
        context: helpers.root('build'),
        fonts: 'assets/fonts/[name].bundle.[ext]',
        images: 'assets/images/[name].bundle.[ext]'
    },
    db_file: helpers.root('services/db.sqlite')
};