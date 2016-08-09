'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

var browserSync = require('browser-sync');

gulp.task('inject-reload', ['inject'], function () {
  browserSync.reload();
});

gulp.task('inject', ['scripts', 'styles'], function () {
  var injectStyles = gulp.src([
    path.join(conf.paths.tmp, '/serve/app/**/*.css'),
    path.join('!' + conf.paths.tmp, '/serve/app/vendor.css')
  ], {read: false});

  var injectScripts = gulp.src([
      path.join(conf.paths.src, '/app/**/*.module.js'),
      path.join(conf.paths.src, '/app/**/*.js'),
      path.join('!' + conf.paths.src, '/app/**/*.spec.js'),
      path.join('!' + conf.paths.src, '/app/**/*.mock.js'),
    ])
    .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));
  var injectOptions = {};


  var analyticsInjectFile = gulp.src(['templates/analytics-staging.html']);
  var analyticsInjectConfig = { // This is the file that has the content that will be injected into index.html
    starttag: '<!-- inject:analytics -->', // Here we tell the location in which we want the injection to occur
    transform: function (filePath, file) {
      return file.contents.toString('utf8') // Return file contents as string
    }
  };


  // if the inject is working in build mode, then use relative path
  // else the filter to find css files in build.js cannot app.css file
  if (this.seq.slice(-1)[0] === "build")
    injectOptions = {
      ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
      addRootSlash: false,
      relative: true
    };
  else
    injectOptions = {
      ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
      addRootSlash: false
    };


  return gulp.src(path.join(conf.paths.src, '/*.html'))
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe($.inject(analyticsInjectFile, analyticsInjectConfig))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});
