const { task, src, dest, watch, series } = require('gulp')
const less = require('gulp-less')
const cssmin = require('gulp-clean-css')
const rename = require('gulp-rename')

task('compile-css', () => {
  return src(['../src/**/*.less', '!../src/style/**'],{nodir: true})
    .pipe(less())
    .pipe(cssmin())
    .pipe(rename((path) => {
      path.extname = '.wxss';
    }))
    .pipe(dest('../dist/'));
})

task('compile-js', () => {
  return src(['../src/**/*.js'])
    .pipe(dest('../dist/'));
})

task('compile-json', () => {
  return src(['../src/**/*.json'])
    .pipe(dest('../dist/'));
})

task('compile-wxml', () => {
  return src(['../src/**/*.wxml'])
    .pipe(dest('../dist/'));
})

task('default', series('compile-css', 'compile-js', 'compile-json', 'compile-wxml'))