module.exports = function () {
    var src = './src/';
    var temp = './.tmp/';
    var config = {
        temp: temp,
        // all js to vet
        alljs: [
            './src/**/*.js',
            './*.js'
        ],
        src: src,
        sass: src + 'style.scss',
        partials: src + '**/*.scss',

        index: src + 'index.html',

        css: temp + '*.css/',
        js: src + 'js/**/*.js',
        bower: {
            json: require('./bower.json'),
            directory: './bower_components/',
            ignorePath: '../..'
        },

        /**
         * Browser-sync
         */
        server: {
            notify: false,
            baseDir: ['./', './src']
        }
    };
    config.getWiredepDefaultOptions = function () {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    };
    return config;
};
