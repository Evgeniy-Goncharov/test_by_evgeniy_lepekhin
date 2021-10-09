const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const csso = require("postcss-csso");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const htmlmin = require("gulp-htmlmin");
const rename = require("gulp-rename");
const squoosh = require("gulp-libsquoosh");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");
const terser = require("gulp-terser");

// HTML

const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({  collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
}

exports.html = html;

// Styles

const styles = () => {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// Scripts

const script = () => {
  return gulp.src("source/js/script.js")
  .pipe(terser())
  .pipe(rename("script.min.js"))
  .pipe(gulp.dest("build/js"))
}

exports.script = script;

// Images

const optimizeImages = () => {
  return gulp.src("source/img/content/*.{jpg,png,svg}")
  .pipe(squoosh())
  .pipe(gulp.dest("build/img"))
}

exports.optimizeImages = optimizeImages;

const copyImages = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
  .pipe(gulp.dest("build/img"))
}

exports.copyImages = copyImages;

// Webp

const createWebp = () => {
  return gulp.src("source/img/**/*.{jpg,png}")
  .pipe(webp({quality: 90}))
  .pipe(gulp.dest("build/img"))
}

exports.createWebp = createWebp;

// Sprite {

const sprite = () => {
  return gulp.src(["source/img/icons/*.svg",
  "source/img/logos/logo.svg"])
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("build/img"))
}

exports.sprite = sprite;

// Clean

const clean = () => {
  return del(["build"])
}

exports.clean = clean;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Reload

const reload = (done) => {
  sync.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series("styles"));
  gulp.watch("source/*.html", gulp.series(html, reload));
  gulp.watch("source/js/*.js", gulp.series(script, reload));
}

// Build

const build = gulp.series(
  clean,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    script,
    sprite,
    createWebp
  )
)

exports.build = build;

// Default

exports.default = gulp.series(
  clean,
  copyImages,
  gulp.parallel(
    html,
    styles,
    script,
    sprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  )
);
