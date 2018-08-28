var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');

gulp.task('html', function(){
  return gulp.src('src/*.html')
    .pipe(gulp.dest('build'))
});

gulp.task('css', function(){
  return gulp.src('src/scss/*.scss')
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(gulp.dest('build/css'))
});

gulp.task('js', function(){
  return gulp.src('src/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/js'))
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('src/js/*.js', ['js']);
  gulp.watch('src/scss/*.scss', ['css']);
  gulp.watch('src/*.html', ['html']);
});

gulp.task('default', [ 'html', 'css', 'js', 'watch' ]);