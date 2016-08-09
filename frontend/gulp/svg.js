'use strict';

var
  path = require('path'),
  gulp = require('gulp'),
  svgSprite = require('gulp-svg-sprite'),
  conf = require('./conf'),
  baseDir = path.join(conf.paths.src, '/assets/'),   // <-- Set to your SVG base directory
  svgGlob = '**/*.svg',       // <-- Glob to match your SVG files
  outDir = path.join(conf.paths.src, '/app/base_styles/svg'),     // <-- Main output directory
  config = {
    "dest": path.join(conf.paths.src, '/app/base_styles/svg/'),
    "mode": {
      "css": {
        "render": {
          "scss": true
        },
        "example": true
      },
      "view": true
    }
  };

gulp.task('svgsprite', function () {
  return gulp.src(svgGlob, {cwd: baseDir})
    .pipe(svgSprite(config)).on('error', function (error) {
      console.log(error);
    })
    .pipe(gulp.dest(outDir))
});
