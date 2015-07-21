//npm install gulp gulp-add-src gulp-clean gulp-concat gulp-htmlmin gulp-minify-css gulp-processhtml gulp-rename gulp-replace gulp-uglify --save-dev
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-minify-css'),
    htmlmin = require("gulp-htmlmin"),
    jsmin = require('gulp-uglify'),
    rename = require('gulp-rename'),
    clean = require("gulp-clean"),
    replace = require('gulp-replace'),
    // imagemin = require('gulp-imagemin'),
    // pngquant = require('imagemin-pngquant'),
    processhtml = require('gulp-processhtml'),
    //cache = require('gulp-cache'),
    addsrc = require('gulp-add-src'),
    //$ = require('gulp-load-plugins')(),
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

    //压缩图片
    //gulp.task('imgmin', function () {
    //    return gulp.src("../img/**/*")
    //
    //        //.pipe(gulpif(option.useCache, cache(imagemin({
    //        //    optimizationLevel: 7, //类型：Number  默认：3  取值范围：0-7（优化等级）
    //        //    progressive: true,//类型：Boolean 默认：false 无损压缩jpg图片
    //        //    interlaced: true,//类型：Boolean 默认：false 隔行扫描gif进行渲染
    //        //    use: [pngquant()]//可以压缩70% //使用pngquant深度压缩png图片的imagemin插件
    //        //}))))
    //        //.pipe(gulpif(!option.useCache,imagemin({
    //        //    optimizationLevel: 7, //类型：Number  默认：3  取值范围：0-7（优化等级）
    //        //    progressive: true,//类型：Boolean 默认：false 无损压缩jpg图片
    //        //    interlaced: true,//类型：Boolean 默认：false 隔行扫描gif进行渲染
    //        //    use: [pngquant()]//可以压缩70% //使用pngquant深度压缩png图片的imagemin插件
    //        //})))
    //        .pipe(imagemin({
    //            optimizationLevel: 7, //类型：Number  默认：3  取值范围：0-7（优化等级）
    //            progressive: true,//类型：Boolean 默认：false 无损压缩jpg图片
    //            interlaced: true,//类型：Boolean 默认：false 隔行扫描gif进行渲染
    //            use: [pngquant()]//可以压缩70% //使用pngquant深度压缩png图片的imagemin插件
    //        }))
    //        .pipe(gulp.dest(option.buildPath + '/img/'))
    //});

    gulp.task("imgcopy", function () {
        gulp.src("../img/**/*")
        .pipe(gulp.dest(option.buildPath + '/img/'))
    })

    //js文件压缩
    gulp.task('jsmin', function () {
        gulp.src(["../js/**/**/*.js",'!../js/libs/*.js'])
            ////.pipe(changed(option.buildPath))
            //.pipe(foreach(function(stream, file){
            //    return stream
            //        //.pipe(size())
            //        .pipe(jsmin())
            //    //.pipe(size())
            //}))
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


// 监视文件的变化
// gulp.task('watch', function() {
//     gulp.watch('../../traffic', ['jshint', 'minify']);
// });


// 默认任务 清空图片、样式、js并重建 运行语句 gulp
gulp.task('default', /*['clean'], */function () {
    gulp.start(/*'jshint', */ 'jsmin', 'cssmin', 'processhtml', "htmlmin", 'imgcopy', 'concat');
});