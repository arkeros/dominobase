/*global require*/
'use strict';

var glob            = require('glob');
var path            = require('path');

var gulp            = require('gulp');
var $               = require('gulp-load-plugins')();
var runSequence     = require('run-sequence');

var rimraf = require('rimraf');
var stylishReporter = require('jshint-stylish');

var config = {
    'srcDir': 'src',
    'tmpDir': '.tmp',
    'buildDir': 'build',
    'distDir': 'dist'
};

gulp.task('haml', function () {
    return gulp.src(config.srcDir + '/**/*.haml')
        .pipe($.rubyHaml())
        .pipe(gulp.dest(config.tmpDir));
});


gulp.task('coffee', function () {
    return gulp.src(config.srcDir + '/scripts/**/*.coffee')
        .pipe($.coffee({bare: true}))
//        .pipe($.closureCompiler({
//            compilerPath: 'bower_components/closure-compiler/compiler.jar',
//            fileName: 'build.js'
//        }))
        .pipe(gulp.dest(config.tmpDir + '/scripts/'));
});

gulp.task('sass', function () {
    return gulp.src(config.srcDir + '/styles/**/*.sass')
        .pipe($.rubySass())
        .pipe($.autoprefixer("last 2 versions", "> 1%", "ie 8", "ie 7"))
        .pipe(gulp.dest(config.tmpDir + '/styles/'));
});

// Clean

gulp.task('clean:build', function (cb) {
    return rimraf(config.buildDir, cb);
});

gulp.task('clean:tmp', function (cb) {
    return rimraf(config.tmpDir, cb);
});

gulp.task('clean', ['clean:tmp', 'clean:build']);


// default
gulp.task('precompile', ['haml', 'sass', 'coffee']);

gulp.task('build:styles', function () {
    return gulp.src(config.tmpDir + '/styles/**/*.css')
        .pipe(gulp.dest(config.buildDir + '/styles/'));
});

gulp.task('build:scripts', function () {
    return gulp.src(config.tmpDir + '/scripts/**/*.js')
        .pipe(gulp.dest(config.buildDir + '/scripts/'));
});

gulp.task('build:html', function () {
    return gulp.src(config.tmpDir + '/*.html')
        .pipe($.smoosher())
        .pipe(gulp.dest(config.buildDir + '/'));
});

gulp.task('build', ['build:styles', 'build:scripts', 'build:html']);


gulp.task('default', ['clean'], function (cb) {
    runSequence(
        'precompile',
        'build',
        cb
    );
});


gulp.task('dist', function () {
    return gulp.src(config.buildDir + '/index.htmld')
        .pipe($.vulcanize({dest: 'dist'}))
        .pipe(gulp.dest(config.distDir + '/'));
});

gulp.task('deploy', ['dist'], function () {
    gulp.src("dist/**/*")
        .pipe($.ghPages());
});
