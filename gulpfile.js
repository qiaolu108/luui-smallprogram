const path = require('path')
const { series, parallel, src, dest, watch } = require('gulp');
const chalk = require('chalk');
const gulpif = require('gulp-if');
const del = require('delete');
const rename = require('gulp-rename');
const less = require('gulp-less')
const cssmin = require('gulp-clean-css')
const postcss = require('gulp-postcss')
const pxtorpx = require('postcss-px2rpx')
const autoprefixer = require('gulp-autoprefixer')
const eslint = require('gulp-eslint')
const tinypngNokey = require('gulp-tinypng-nokey')

const ENV = process.env.NODE_ENV
const isProd = ENV === 'production'
const basePath = isProd ? 'dist' : 'examples/dist'
console.log(chalk.greenBright(isProd ? '生产' : '开发'))

// 清空dist文件
function clean (cb) {
  del.promise(basePath, {force: true}).then(function (files, err) {
    console.log(chalk.green(`清理${files}完成`));
    cb()
  });
}
// copy js文件到dist目录
function copyJs () {
  return src('src/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(dest(basePath))
}

// multiplier: 1 不管用，先放着吧
// 编译less并拷贝到dist目录
function compileCss () {
  return src(['src/**/*.less', '!src/style/**'], {nodir: true})
    .pipe(postcss([pxtorpx({multiplier: 1})]))
    .pipe(autoprefixer([
      'iOS >= 8',
      'Android >= 4.1'
    ]))
    .pipe(less())
    .pipe(gulpif(isProd, cssmin()))
    .pipe(rename({extname: '.wxss'}))
    .pipe(dest(basePath))
}

// 拷贝 wxml wxss json 到dist文件
function copyWxmlWxssJson () {
  return src(['src/**/*.wxml', 'src/**/*.wxss', 'src/**/*.json'])
    .pipe(dest(basePath))
}

// 拷贝 img 到dist 文件夹
function copyImages () {
  return src('src/images/*.{png,jpg,jpeg,gif,ico}')
    .pipe(tinypngNokey())
    .pipe(dest(`${basePath}/images`))
}

// 修改文件后缀名
function modifySuffix (str) {
  let suffix = path.extname(str)
  if (suffix === '.less') {
    return str.replace('src', 'dist').replace('.less', '.wxss')
  } else {
    return str.replace('src', 'dist')
  }
}

// 监听文件, 新增文件都可以监听到了，删除文件监听不到明天想办法
function auto () {
  watch('src/**/*.less', compileCss).on('all', function(path, stats) {
    // console.log(chalk.yellowBright(`删除less文件：${path}---${stats}`))
    // let oPath = modifySuffix(path)
    // console.log(oPath)
    // del.sync(oPath)
    series(compileCss)
  })
  watch('src/**/*.js', copyJs).on('all', function (path, stats) {
    // console.log(chalk.yellowBright(`删除js文件：${path}---${stats}`))
    // let oPath = modifySuffix(path)
    // console.log(oPath)
    // del.sync(oPath)
    series(copyJs)
  })
  watch(['src/**/*.wxml', 'src/**/*.wxss', 'src/**/*.json'], copyWxmlWxssJson).on('all', function (path, stats) {
    // console.log(chalk.yellowBright(`删除文件：${path}---${stats}`))
    // let oPath = modifySuffix(path)
    // console.log(oPath)
    // del.sync(oPath)
    series(copyWxmlWxssJson)
  })
  watch('src/images/*.{png,jpg,jpeg,gif,ico}', copyImages).on('all', function (path,stats) {
    series(copyImages)
  })
}

if (process.env.NODE_ENV === 'production') {
  exports.build = series(clean, parallel(copyJs, compileCss, copyWxmlWxssJson, copyImages))
} else {
  exports.default = series(clean, parallel(copyJs, compileCss, copyWxmlWxssJson, copyImages), auto)
}