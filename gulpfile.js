const { src, dest, series, watch } = require('gulp');
const concat = require('gulp-concat');
const htmlmin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const svgSprite = require('gulp-svg-sprite');
const image = require('gulp-image');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');

const clean = () => {
  return del('dist');
};

const resources = () => {
  return src('./src/resorces/fonts/**').pipe(dest('dist/resorces/fonts'));
};

const stylesDev = () => {
  return src('./src/style/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(concat('main.css'))
    .pipe(sourcemaps.write())
    .pipe(dest('dist/style'))
    .pipe(browserSync.stream());
};

const stylesBuild = () => {
  return src('./src/style/**/*.css')
    .pipe(concat('main.css'))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(cleanCSS({ level: 2 }))
    .pipe(dest('dist/style'));
};

const htmlBuild = () => {
  return src('./src/html/**/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
};

const htmlDev = () => {
  return src('./src/html/**/*.html').pipe(dest('dist'));
};

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
  });
};

const svgSprites = () => {
  return src('./src/resorces/images/svg/**/*.svg')
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: '../sprite.svg',
          },
        },
      })
    )
    .pipe(dest('./dist/resorces/images'));
};

const images = () => {
  return src([
    './src/resorces/images/*.jpg',
    './src/resorces/images/*.jpeg',
    './src/resorces/images/*.svg',
    './src/resorces/images/*.png',
  ])
    .pipe(image())
    .pipe(dest('dist/resorces/images'));
};

const optimizeJsDev = () => {
  return src('./src/scripts/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(dest('dist/script'))
    .pipe(browserSync.stream());
};

const optimizeJsBuild = () => {
  return src('./src/scripts/**/*.js')
    .pipe(
      uglify({
        toplevel: true,
      })
    )
    .pipe(dest('dist/script'));
};

watch('./src/html/**/*.html', htmlDev);
watch('./src/style/**/*.css', stylesDev);
watch('./src/images/svg/**/*.svg', svgSprites);
watch('./src/scripts/**/*.js', optimizeJsDev);
watch('./src/resources/**', resources);

exports.clean = clean;
exports.dev = series(
  clean,
  resources,
  stylesDev,
  optimizeJsDev,
  htmlDev,
  images,
  svgSprites,
  watchFiles
);
exports.build = series(
  clean,
  resources,
  stylesBuild,
  optimizeJsBuild,
  htmlBuild,
  images,
  svgSprites
);
