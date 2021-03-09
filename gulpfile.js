const gulp = require('gulp');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-minify-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const livereload = require('gulp-livereload');
const pdf = require('gulp-html-pdf')
const mustache = require('mustache')
const resumeJson = require('./src/resume.json')
const through = require('through2')
const rename = require("gulp-rename")

const distPath = "appengine/static"

gulp.task('html', () =>{
  return gulp.src('src/index.template')
    .pipe(
      through.obj((file, enc, cb) => {
        var template = file.contents.toString()
        file.contents = Buffer.from(mustache.render(template, resumeJson))
        cb(null, file)
      }
    ))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(distPath))
});

gulp.task('pdf', () =>{
  return gulp.src('src/pdf.template')
    .pipe(through.obj((file, enc, cb) => {
      var template = file.contents.toString()
      file.contents = Buffer.from(mustache.render(template, resumeJson))
      cb(null, file)
    }))
    .pipe(pdf())
    .pipe(rename('resume.pdf'))
    .pipe(gulp.dest(distPath))
});

gulp.task('sass', () =>{
  return gulp.src('src/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest(distPath + '/css'))
});

gulp.task('css-min', ['sass'], () =>{
  return gulp.src(distPath + '/css/*.css')
    .pipe(concat('app.min.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest(distPath + '/css'))
});

gulp.task('js', () =>{
  return gulp.src('src/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(distPath + '/js'))
});

gulp.task('icons', () =>{
  return gulp.src('src/icons/**')
    .pipe(gulp.dest(distPath + '/'))
});

gulp.task('fonts', () =>{
  return gulp.src('src/fonts/**')
    .pipe(gulp.dest(distPath + '/fonts'))
});

gulp.task('watch', () => {
  livereload.listen();
  gulp.watch('src/js/*.js', ['js']);
  gulp.watch('src/scss/*.scss', ['css']);
  gulp.watch('src/*.html', ['html']);
});

gulp.task('default', [ 'html', 'sass', 'css-min', 'js', 'pdf', 'icons', 'fonts' ]);
