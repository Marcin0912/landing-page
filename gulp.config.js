module.exports = function() {
    var config = {
        temp: './tmp/',
        src: './src',
        index: './src/index.html',
        partials: './src/partials/*.*',
        scss: './src/style.scss',
        css: './tmp/css/',
        js: './src/js/**/*.js',
        bower: {
            json: require('./bower.json'),
            directory: './bower_components/',
            ignorePath: '../..'
        },

        /**
        * Browser-sync
        */
        server : {
            notify: false,
            baseDir: ['./', './src']
        }
    };
    config.getWiredepDefaultOptions = function() {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
            };
            return options;
        };
    return config;
};
