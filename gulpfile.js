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
const htmlMin = require("gulp-htmlmin")
const size = require("gulp-size")
const newer = require("gulp-newer")
const pug = require("gulp-pug")
const stylus = require("gulp-stylus")
const ts = require("gulp-typescript")
const coffee = require("gulp-coffee")
const sass = require("gulp-sass")(require("sass"))
const browserSync = require("browser-sync").create()

// Пути
const path = {
    html: {
        src: ["src/*.html", "src/*.pug"],
        dest: "dist/"
    },
    styles: {
        src: ['src/styles/**/*.less', 'src/styles/**/*.styl',
            'src/styles/**/*.sass','src/styles/**/*.scss','src/styles/**/*.css'],
        dest: 'dist/css/'
    },
    scripts: {
        src: ['src/scripts/**/*.js', 'src/scripts/**/*.ts', 'src/scripts/**/*.coffee'],
        dest: 'dist/js/'
    },
    img: {
        src: 'src/img/**',
        dest: 'dist/img/'
    }
}

// Задача удаления
function clean() {
    return del(['dist/*', '!dist/img'])
}

// Задача обработки html
function html(){
    return gulp.src(path.html.src)
        // .pipe(pug())
        .pipe(htmlMin({ collapseWhitespace: true}))
        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest(path.html.dest))
        .pipe(browserSync.stream())
}

// Задача преобразования стилей
function styles() {
    return gulp.src(path.styles.src)
        .pipe(sourcemaps.init())
        // .pipe(sass().on('error', sass.logError))
        // .pipe(stylus())
        // .pipe(less())
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(concat('main.min.css'))
        .pipe(sourcemaps.write("."))
        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest(path.styles.dest))
        .pipe(browserSync.stream())
}

// Задача для обработки скриптов
function scripts() {
    return gulp.src(path.scripts.src)
        .pipe(sourcemaps.init())
        // .pipe(coffee({bare:true}))
        // .pipe(ts({
        //     noImplicitAny: true,
        //     outFile: 'main.min.js'
        // }))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(sourcemaps.write("."))
        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest(path.scripts.dest))
        .pipe(browserSync.stream())
}


// Задача для обработки изображений
function img() {
    return gulp.src(path.img.src)
        .pipe(newer(path.img.dest))
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
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    })
    gulp.watch(path.html.dest).on('change', browserSync.reload)
    gulp.watch(path.html.src, html)
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