'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var modernizr = require('gulp-modernizr');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

gulp.task('modernizr', function () {
  gulp.src([path.join(conf.paths.src, '/**/*.js'), path.join(conf.paths.src, '/**/*.scss')])
    .pipe(modernizr({
      options: [
        "setClasses"
      ],
      classPrefix: 'supports-'
    }))
    .pipe(gulp.dest(conf.paths.src + '/app/vendor/'));
});

gulp.task('scripts-reload', function () {
  return buildScripts()
    .pipe(browserSync.stream());
});

gulp.task('scripts', function () {
  return buildScripts();
});

function buildScripts() {
  gulp.start('modernizr');

  return gulp.src([path.join(conf.paths.src, '/scripts/**/*.js'), path.join('!' + conf.paths.src, '/scripts/**/modernizr.js') ])
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.size());
}
