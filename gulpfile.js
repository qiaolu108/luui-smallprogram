const nodePath = require('path')
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
const aliases = require('gulp-wechat-weapp-src-alisa');
// 用于处理node的stream
const through = require('through2');
// 错误提示
const PluginError = require('plugin-error');


const ENV = process.env.NODE_ENV
const isProd = ENV === 'production'
const basePath = isProd ? 'dist/**/*' : 'examples/dist/**/*'
console.log(chalk.greenBright(isProd ? '生产' : '开发'))

const lessPaths = ['src/**/*.less', '!src/style/**/**']

// 路径拼接
function _join(dirname) {
  return nodePath.join(process.cwd(), dirname)
}

// 引用路径别名配置 @src/ === src/
const aliasConfig = {
  '@src': _join('src')
}

// json 文件的 alias 替换
function aliasesJson () {
  return through.obj((file, enc, cb) => {
    if (file.isNull()) {
      return cb(null, file);
    }
    if (file.isStream()) {
        return cb(new PluginError('gulp-path-alias', 'stream not supported'));
    }
    let content = file.contents.toString('utf8');
    let fromPath = nodePath.resolve(file.path)
    content = content.replace(/@src(.*?)+/g, ($1) => {
      let toPath = nodePath.join(process.cwd(), '/src', $1.split('@src')[1])
      let relative = nodePath.relative(fromPath, toPath)
      return $1.replace(/@src(.*?)+/g, relative)
    })
    file.contents = Buffer.from(content);
    cb(null, file);
  })
}

// 清空dist文件
function clean (cb) {
  del([basePath], function (err, deleted) {
    if (err) throw err
    cb()
    console.log(chalk.green(`清理/dist完成`));
  })
}
// copy js文件到dist目录
function copyJs () {
  return src('src/**/*.js')
    .pipe(aliases(aliasConfig))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(dest(basePath))
}

// multiplier: 1 不管用，先放着吧
// 编译less并拷贝到dist目录
function compileCss () {
  return src(lessPaths, {nodir: true})
    .pipe(aliases(aliasConfig))
    .pipe(less())
    .pipe(postcss([pxtorpx({multiplier: 1})]))
    .pipe(autoprefixer([
      'iOS >= 8',
      'Android >= 4.1'
    ]))
    // .pipe(gulpif(isProd, cssmin())) // 组件库，开发生产都不压缩css
    .pipe(rename({extname: '.wxss'}))
    .pipe(dest(basePath))
}

// 拷贝 wxml wxss wxs 到dist文件
function copyWxmlWxss () {
  return src(['src/**/*.wxml', 'src/**/*.wxss', 'src/**/*.wxs'])
    .pipe(aliases(aliasConfig))  
    .pipe(dest(basePath))
}

// 拷贝 json 文件到 dist 文件夹
function copyJson () {
  return src('src/**/*.json')
  .pipe(aliasesJson())
  .pipe(dest('dist'))
}

// 拷贝 img 到dist 文件夹
function copyImages () {
  return src('src/images/*.{png,jpg,jpeg,gif,ico}')
    .pipe(dest(`${basePath}/images`))
}

// 修改文件后缀名
function modifySuffix (str) {
  let suffix = nodePath.extname(str)
  if (suffix === '.less') {
    return str.replace('src', 'dist').replace('.less', '.wxss')
  } else {
    return str.replace('src', 'dist')
  }
}

// 监听文件,
function auto () {
  const watcherLess = watch(lessPaths, compileCss)
  const watcherJs = watch('src/**/*.js', copyJs)
  const watchOther = watch(['src/**/*.wxml', 'src/**/*.wxss', 'src/**/*.wxs'], copyWxmlWxss)
  const watchJson = watch('src/**/*.json', copyJson)
  const watchImages = watch('src/images/*.{png,jpg,jpeg,gif,ico}', copyImages)

  watcherLess.on('add', function (path, stats) {})
  watcherLess.on('unlink', function (path, stats) {
    let oPath = modifySuffix(path)
    del.sync(oPath)
  })

  watcherJs.on('add', function (path, stats) {})
  watcherJs.on('unlink', function (path, stats) {
    let oPath = modifySuffix(path)
    del.sync(oPath)
  })

  watchOther.on('add', function (path, stats) {})
  watchOther.on('unlink', function (path, stats) {
    let suffix = nodePath.extname(path)
    let oPath = modifySuffix(path)
    del.sync(oPath)
  })

  watchJson.on('add', function (path, stats) {})
  watchJson.on('unlink', function (path, stats) {
    let oPath = modifySuffix(path)
    del.sync(oPath)
  })

  watchImages.on('add', function (path, stats) {})
  watchImages.on('unlink', function (path, stats) {
    let oPath = modifySuffix(path)
    del.sync(oPath)
  })
  console.log(chalk.greenBright('监听文件中...'))
}

if (process.env.NODE_ENV === 'production') {
  exports.build = series(clean, parallel(copyJs, compileCss, copyWxmlWxss, copyJson, copyImages))
} else {
  exports.default = series(clean, parallel(copyJs, compileCss, copyWxmlWxss, copyJson, copyImages), auto)
}