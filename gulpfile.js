const gulp = require("gulp")
const less = require("gulp-less")
const del = require("del")
const rename = require("gulp-rename")
const cleanCSS = require("gulp-clean-css")
const babel = require("gulp-babel")
const uglify = require("gulp-uglify")
const concat = require("gulp-concat")
const sourcemaps = require("gulp-sourcemaps")
const autoprefixer = require("gulp-autoprefixer")
const imagemin = require("gulp-imagemin")
const htmlmin = require("gulp-htmlmin")
const size = require("gulp-size")


const path = {
    html: {
        src: "src/*.html",
        dest: "dist/"
    },
    styles: {
        src: 'src/styles/**/*.less',
        dest: 'dist/css/'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'dist/js/'
    },
    img: {
        src: 'src/img/**/*',
        dest: 'dist/img/'
    }
}

// Задача удаления
function clean() {
    return del(["dist"])
}

// Задача обработки html
function html(){
    return gulp.src(path.html.src)
        .pipe(htmlmin({ collapseWhitespace: true}))
        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest(path.html.dest))
}

// Задача преобразования стилей
function styles() {
    return gulp.src(path.styles.src)
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(concat('main.min.css'))
        .pipe(sourcemaps.write("./"))
        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest(path.styles.dest))
}

// Задача для обработки скриптов
function scripts() {
    return gulp.src(path.scripts.src)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(sourcemaps.write("./"))
        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest(path.scripts.dest))
}


// Задача для обработки изображений
function img() {
    return gulp.src(path.img.src)
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest(path.img.dest))
}

// Задача наблюдатель
function watch() {
    gulp.watch(path.styles.src, styles)
    gulp.watch(path.scripts.src, scripts)
    gulp.watch(path.img.src, img)
}

const build = gulp.series(clean, html, gulp.parallel(scripts, styles, img), watch)

exports.clean = clean
exports.html = html
exports.styles = styles
exports.scripts = scripts
exports.img = img
exports.watch = watch
exports.build = build
exports.default = build