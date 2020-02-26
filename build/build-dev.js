const { task, src, dest, watch, series } = require('gulp')
const less = require('gulp-less')
const cssmin = require('gulp-clean-css')
const rename = require('gulp-rename')
const eslint = require('gulp-eslint')

task('compile-css', () => {
  return src(['../src/**/*.less', '!../src/style/**'], {nodir: true})
    .pipe(less())
    .pipe(cssmin())
    .pipe(rename((path) => {
      path.extname = '.wxss';
    }))
    .pipe(dest('../examples/dist/'));
})

task('compile-js', () => {
  return src(['../src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(dest('../examples/dist/'));
})

task('compile-json', () => {
  return src(['../src/**/*.json'])
    .pipe(dest('../examples/dist/'));
})

task('compile-wxml', () => {
  return src(['../src/**/*.wxml'])
    .pipe(dest('../examples/dist/'));
})

task('auto', () => {
  watch('../src/**/*.less', series('compile-css'));
  watch('../src/**/*.js', series('compile-js'));
  watch('../src/**/*.json', series('compile-json'));
  watch('../src/**/*.wxml', series('compile-wxml'));
})

task('default', series('compile-css', 'compile-js', 'compile-json', 'compile-wxml', 'auto'));
