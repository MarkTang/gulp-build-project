//npm install gulp gulp-add-src gulp-clean gulp-concat gulp-htmlmin gulp-minify-css gulp-processhtml gulp-rename gulp-replace gulp-uglify --save-dev
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-minify-css'),
    htmlmin = require("gulp-htmlmin"),
    jsmin = require('gulp-uglify'),
    rename = require('gulp-rename'),
    clean = require("gulp-clean"),
    replace = require('gulp-replace'),
    processhtml = require('gulp-processhtml'),
    addsrc = require('gulp-add-src'),
    option = {
        buildPath: "../dist",
        useCache:1//图片压缩是否采用缓存
    };
    //构建目录清理
    gulp.task("clean", function (done) {
        //return cache.clearAll(done);
        return gulp.src(option.buildPath, {
            read: false
        })
        .pipe(clean({force: true}));

    })

    gulp.task("imgcopy", function () {
        gulp.src("../img/**/*")
        .pipe(gulp.dest(option.buildPath + '/img/'))
    })

    //js文件压缩
    gulp.task('jsmin', function () {
        gulp.src(["../js/**/**/*.js",'!../js/libs/*.js'])
            .pipe(jsmin())
            .pipe(gulp.dest(option.buildPath+ "/js/"))
});

//需要合并和压缩的文件
gulp.task('concat', function () {
    gulp.src(['../js/libs/angular.min.js','../js/libs/*.js', '!../js/libs/reeoo*.js'])
        .pipe(concat('libs.min.js'))
        .pipe(jsmin())
        .pipe(addsrc('../js/libs/reeoo*.js'))
        .pipe(jsmin())
        .pipe(gulp.dest(option.buildPath + "/js/libs/"))
});


gulp.task("processhtml", function () {
    var date = new Date().getTime();
    gulp.src('../main.html')
        // .pipe(template({
        //     version: date
        // }))
        .pipe(replace(/_VERSION_/gi, date))
        .pipe(processhtml())
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(option.buildPath + '/'))
})


//压缩css
gulp.task("cssmin", function () {
    gulp.src("../style/*.css")
        .pipe(cssmin())
        .pipe(gulp.dest(option.buildPath + '/style'))
})

//压缩html文件
gulp.task("htmlmin", function () {
    gulp.src('../views/**/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(option.buildPath + '/views'))
})


// 默认任务 清空图片、样式、js并重建 运行语句 gulp
gulp.task('default', /*['clean'], */function () {
    gulp.start(/*'jshint', */ 'jsmin', 'cssmin', 'processhtml', "htmlmin", 'imgcopy', 'concat');
});