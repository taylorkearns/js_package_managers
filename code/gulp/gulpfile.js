var gulp = require("gulp");
var coffee = require("gulp-coffee");
var sass = require("gulp-sass");
var uglify = require("gulp-uglify");

gulp.task("default", function() {
  gulp.src("./src/*.coffee").
    pipe(coffee()).
    pipe(uglify()).
    pipe(gulp.dest("./dest/"));

  gulp.src("./src/*.scss").
    pipe(sass()).
    pipe(gulp.dest("./dest"));
});
