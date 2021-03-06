'use strict';

/* пути к исходным файлам (src), к готовым файлам (build), а также к тем, за изменениями которых нужно наблюдать (watch) */
var path = {
    build: {
        html: 'assets/build/',
        js: 'assets/build/js/',
        css: 'assets/build/css/',
        img: 'assets/build/img/',
        fonts: 'assets/build/fonts/',
        pugFrom: 'assets/src/',
        pugToHtml: 'assets/src/',
        json: 'assets/build/json',
        php: 'assets/build/'
    },
    src: {
        html: 'assets/src/templates/blocks/index/*.html',
        js: 'assets/src/main.js',
        style: 'assets/src/main.scss',
        img: 'assets/src/img/**/*.*',
        fonts: 'assets/src/fonts/**/*.*',
        pug: 'assets/src/**/*.pug',
        json: 'assets/src/json/**/*.json',
        php: 'assets/src/**/*.php'
    },
    watch: {
        html: 'assets/src/**/*.html',
        js: 'assets/src/**/*.js',
        css: 'assets/src/**/*.+(scss|sass)',
        img: 'assets/src/img/**/*.*',
        fonts: 'assets/srs/fonts/**/*.*',
        pug: 'assets/src/**/*.pug',
        json: 'assets/src/json/**/*.json',
        php: 'assets/src/**/*.php'
    },
    clean: './assets/build/*'
};

/* настройки сервера */
var config = {
//    настройка удалена для работы proxy.php
    server: {
        baseDir: './assets/build'
    },
//    proxy: 'ptest.ru',
    notify: false
};

/* подключаем gulp и плагины */
var gulp = require('gulp'),  // подключаем Gulp
    webserver = require('browser-sync'), // сервер для работы и автоматического обновления страниц
    plumber = require('gulp-plumber'), // модуль для отслеживания ошибок
    rigger = require('gulp-rigger'), // модуль для импорта содержимого одного файла в другой
    sourcemaps = require('gulp-sourcemaps'), // модуль для генерации карты исходных файлов
    sass = require('gulp-sass'), // модуль для компиляции SASS (SCSS) в CSS
    autoprefixer = require('gulp-autoprefixer'), // модуль для автоматической установки автопрефиксов
    cleanCSS = require('gulp-clean-css'), // плагин для минимизации CSS
    uglify = require('gulp-uglify'), // модуль для минимизации JavaScript
    cache = require('gulp-cache'), // модуль для кэширования
    imagemin = require('gulp-imagemin'), // плагин для сжатия PNG, JPEG, GIF и SVG изображений
    jpegrecompress = require('imagemin-jpeg-recompress'), // плагин для сжатия jpeg	
    pngquant = require('imagemin-pngquant'), // плагин для сжатия png
    rimraf = require('gulp-rimraf'), // плагин для удаления файлов и каталогов
    rename = require('gulp-rename'),
    pug = require('gulp-pug'), // плагин для конвертации pug в HTML
    pugInheritance = require('gulp-pug-inheritance'), // аппаратная поддержка конвертации при больших объёмах файлов
    jsonminify = require('gulp-jsonminify'), // минификация json файлов
    htmlmin = require('gulp-htmlmin'); // минификатор html

/* задачи */

// запуск сервера
gulp.task('webserver', function () {
    webserver(config);
});

// сбор html
gulp.task('html:build', function () {
    return gulp.src(path.src.html) // выбор всех html файлов по указанному пути
        .pipe(plumber()) // отслеживание ошибок
        .pipe(rigger()) // импорт вложений
        .pipe(htmlmin({ collapseWhitespace: true }))//минификация html
        .pipe(gulp.dest(path.build.html)) // выкладывание готовых файлов
        .pipe(webserver.reload({ stream: true })); // перезагрузка сервера
});


//конвертация pug в html///////////////////////////////////////////
gulp.task('pug:build', function() {
  return gulp.src(path.src.pug)
    .pipe(plumber()) // для отслеживания ошибок
    .pipe(pugInheritance({basedir: path.build.pugFrom})) // для ускорения 
    .pipe(pug(
      {pretty: true} // для табулятивной разметки: адекватный просмотр перед минификацией
      ))
    .pipe(gulp.dest(path.build.pugToHtml))
    .pipe(webserver.reload({ stream: true })); // перезагрузка сервера
});

// //сборка PHP пакетов
// gulp.task('php:build', function () {
//     return gulp.src(path.src.php) // выбор всех html файлов по указанному пути
// //        .pipe(plumber()) // отслеживание ошибок
// //        .pipe(rigger()) // импорт вложений
// //        .pipe(phpmin())//минификация php (использует стандарт ES6)
// //        .pipe(htmlmin({ collapseWhitespace: true }))//минификация тэгов html
//         .pipe(gulp.dest(path.build.php)) // выкладывание готовых файлов
//         .pipe(webserver.reload({ stream: true })); // перезагрузка сервера
// });


// сбор стилей
gulp.task('css:build', function () {
    return gulp.src(path.src.style) // получим main.scss
        .pipe(plumber()) // для отслеживания ошибок
        .pipe(sourcemaps.init()) // инициализируем sourcemap
        .pipe(sass()) // scss -> css
        .pipe(autoprefixer()) // добавим префиксы
        .pipe(gulp.dest(path.build.css))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cleanCSS()) // минимизируем CSS
        .pipe(sourcemaps.write('./')) // записываем sourcemap
        .pipe(gulp.dest(path.build.css)) // выгружаем в build
        .pipe(webserver.reload({ stream: true })); // перезагрузим сервер
});

// сбор js
gulp.task('js:build', function () {
    return gulp.src(path.src.js) // получим файл main.js
        .pipe(plumber()) // для отслеживания ошибок
        .pipe(rigger()) // импортируем все указанные файлы в main.js
        .pipe(gulp.dest(path.build.js))
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.init()) //инициализируем sourcemap
        .pipe(uglify()) // минимизируем js
        .pipe(sourcemaps.write('./')) //  записываем sourcemap
        .pipe(gulp.dest(path.build.js)) // положим готовый файл
        .pipe(webserver.reload({ stream: true })); // перезагрузим сервер
});

//ФУНКЦИИ шрифтов и картинок ОТКЛЮЧЕНЫ
//ПОТОМУ КАК В ДАННОМ ПРОЕКТЕ ПОКА НЕ ИСПОЛЬЗУЮТСЯ

// перенос шрифтов
//  gulp.task('fonts:build', function () {
//     return gulp.src(path.src.fonts)
//         .pipe(gulp.dest(path.build.fonts));
// });

//обработка картинок
gulp.task('image:build', function () {
    return gulp.src(path.src.img) // путь с исходниками картинок
        .pipe(cache(imagemin([ // сжатие изображений
            imagemin.gifsicle({ interlaced: true }),
            jpegrecompress({
                progressive: true,
                max: 90,
                min: 80
            }),
            pngquant(),
            imagemin.svgo({ plugins: [{ removeViewBox: false }] })
        ])))
        .pipe(gulp.dest(path.build.img)); // выгрузка готовых файлов
});

// // перенос json контента
// gulp.task('json:build', function () {
//     return gulp.src(path.src.json)
//         .pipe(jsonminify())
//         .pipe(gulp.dest(path.build.json))
//         .pipe(webserver.reload({ stream: true })); //спорный момент при постоянной редакции может надоесть
// });

// удаление каталога build 
gulp.task('clean:build', function () {
    return gulp.src(path.clean, { read: false })
        .pipe(rimraf());
});

// очистка кэша для картинок, запускается вручную при изменении их количества
gulp.task('cache:clear', function () {
    cache.clearAll();
});

// сборка
gulp.task('build',
    gulp.series('clean:build',
        gulp.parallel(
            'pug:build',
            'html:build',
            'css:build',
            'js:build',
            'image:build',
//             'php:build',
//            'fonts:build',
//            'json:build',
        )
    )
);

// запуск задач при изменении файлов
gulp.task('watch', function () {
    gulp.watch(path.watch.pug, gulp.series('pug:build'));
    gulp.watch(path.watch.html, gulp.series('html:build'));
    gulp.watch(path.watch.css, gulp.series('css:build'));
    gulp.watch(path.watch.js, gulp.series('js:build'));
    gulp.watch(path.watch.img, gulp.series('image:build'));
//    gulp.watch(path.watch.fonts, gulp.series('fonts:build'));
//    gulp.watch(path.watch.json, gulp.series('json:build'));
//    gulp.watch(path.watch.php, gulp.series('php:build'));
});

// задача по умолчанию
gulp.task('default', gulp.series(
    'build',
    gulp.parallel('webserver','watch')
));
