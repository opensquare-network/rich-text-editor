const gulp = require("gulp");
const ts = require("gulp-typescript");
const sass = require("gulp-sass");
const merge = require("merge2");
const tsProject = ts.createProject("./tsconfig.build.json");

function buildStyles() {
  return gulp
    .src("./src/styles/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./lib/styles/css"));
}

// library
function copyStyles() {
  return gulp
    .src("./src/styles/**/*.scss")
    .pipe(gulp.dest("./lib/styles/scss"));
}

// depends on copyStyles and buildStyles
function buildLib() {
  const tsResult = tsProject.src().pipe(
    tsProject({
      declaration: true
    })
  );
  return merge([
    tsResult.dts.pipe(gulp.dest("lib/definitions")),
    tsResult.js.pipe(gulp.dest("lib/js"))
  ]);
}


exports.build = gulp.series(buildStyles, copyStyles, buildLib);
