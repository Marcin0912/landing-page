var del = require('del');
var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var wiredep = require('wiredep');
var $ = require('gulp-load-plugins')({
    lazy: true,
    rename: {
        'gulp-ruby-sass': 'sass'
    }
});
var reload = browserSync.reload;

var config = require('./gulp.config')();

// Static server

gulp.task('serve', ['wiredep'], function() {
    log('Starting server ...');
    browserSync.init({server: config.server});

    gulp.watch([config.partials], ['sass', reload]);
    gulp.watch([config.scss], reload );
    gulp.watch([config.index], reload);

});

gulp.task('clean-styles', function(done) {
    clean(config.temp + '**/*.css', done);
});

gulp.task('sass', function() {
    log('Compiling Sass -> CSS');
    return $.sass(config.scss, {sourcemap: true, compass: true})
        .on('error', function(err) {
            console.log('Error', err.message);
        })
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(config.css));
    // gulp
    //     .src(config.scss)
    //     .pipe($.sourcemaps.init())
    //     .pipe($.sass())
    //     .pipe($.sourcemaps.write())
    //     .pipe(gulp.dest(config.css));
        // .pipe(reload({stream: true}));
});

gulp.task('wiredep', ['clean-styles', 'sass'],  function() {
    var options = config.getWiredepDefaultOptions();
    log('Wire up the bower css js and custom js into the html');
    var wiredep = require('wiredep').stream;
        return gulp
            .src(config.index)
            .pipe(wiredep(options))
            .pipe($.inject(gulp.src([config.js, config.css + '*.css'])))
            .pipe(gulp.dest(config.src));
});







gulp.task('default', ['serve']);



//////////

function clean(path, done) {
    log('Cleaning: ' + $.util.colors.green(path));
    del(path, done);
}

function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnPropert(item)) {
                $.util.log($.util.colors.green(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.green(msg));
    }
}
