const gulp = require("gulp")
const less = require("gulp-less")
const del = require("del")
const rename = require("gulp-rename")
const cleanCSS = require("gulp-clean-css")
const babel = require("gulp-babel")
const uglify = require("gulp-uglify")
const concat = require("gulp-concat")

const path = {
    styles: {
        src: 'src/styles/**/*.less',
        dest: 'dist/css/'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'dist/js/'
    }
}

// Задача удаления
function clean() {
    return del(["dist"])
}

// Задача преобразования стилей
function styles() {
    return gulp.src(path.styles.src)
        .pipe(less())
        .pipe(cleanCSS())
        .pipe(concat('main.min.css'))
        .pipe(gulp.dest(path.styles.dest))
}

// Задача для обработки скриптов
function scripts() {
    return gulp.src(path.scripts.src, {
        sourcemaps: true
    })
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest(path.scripts.dest))
}

// Задача наблюдатель
function watch() {
    gulp.watch(path.styles.src, styles)
    gulp.watch(path.scripts.src, scripts)
}

const build = gulp.series(clean, gulp.parallel(scripts, styles), watch)

exports.clean = clean
exports.styles = styles
exports.scripts = scripts
exports.watch = watch
exports.build = build
exports.default = build