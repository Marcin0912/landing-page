
var del = require('del');
var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var del = require('del');
var args = require('yargs').argv;
var $ = require('gulp-load-plugins')();

var config = require('./gulp.config')();

gulp.task('styles', ['clean-styles'], function() {
    log('Compiling sass ---> CSS' +  ' to ' + config.temp);
    return $.rubySass(config.sass, {sourcemap: true})
        .pipe($.plumber())
        .pipe($.sourcemaps.write())
        .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
        .pipe($.plumber.stop())
        .pipe(gulp.dest(config.temp));
});

gulp.task('clean-styles', function() {
    var files = config.temp + '**/*.css';
    clean(files);
});

gulp.task('sass-watcher', function() {
    log('Watching ' + config.partials);
    return gulp.watch([config.partials], ['styles']);
});

// vet js files
gulp.task('vet', function() {
    log('Analyzing source with JSHint and JSCS');
    gulp.src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe($.jshint.reporter('fail'));
});

// Static server
gulp.task('serve', ['inject'], function() {
    log('Starting server ...');
    browserSync.init({server: config.server});
    gulp.watch([config.partials], ['sass', reload]);
    gulp.watch([config.scss], reload);
    gulp.watch([config.index], reload);

});

gulp.task('wiredep',  function() {
    log('Wire up the bower css js and custom js into the html');
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;
    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.js)))
//        .pipe($.plumber())
        .pipe(gulp.dest(config.src));
});

gulp.task('inject', ['wiredep', 'styles'],  function() {
    log('Wire up the bower css js custom js and custom css into the html');
    return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(config.css)))
        .pipe(gulp.dest(config.src));
});

//gulp.task('default', ['serve']);
//////////

function clean(path) {
    log('Cleaning: ' + $.util.colors.green(path));
    del(path);
}

function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.green(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.green(msg));
    }
}
