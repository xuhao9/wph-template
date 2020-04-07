const gulp = require('gulp'),
    minifycss = require('gulp-minify-css'), //css压缩
    concat = require('gulp-concat'), //合并文件
    uglify = require('gulp-uglify'), //js压缩
    rename = require('gulp-rename'), //文件重命名
    del = require('del'),
    notify = require('gulp-notify'),
    babel = require('gulp-babel'),
    gutil = require('gutil'), //提示
    connect = require('gulp-connect'),
    cp = require('child_process');

// css
gulp.task('minifycss',function(){
    return gulp.src('css/*.css')      //设置css
        .pipe(concat('index.css'))      //合并css文件到"index"
        .pipe(rename({suffix:'.min'}))         //修改文件名
        .pipe(minifycss())                    //压缩文件
        .pipe(gulp.dest('css/min'))           //设置输出路径
        .pipe(notify({message:'css task ok'}));   //提示成功
});

//JS处理
gulp.task('minifyjs',function(){
    return gulp.src('js/*.js')  //选择合并的JS
        .pipe(babel({
            presets: ['es2015'] // es5检查机制
        }))
        .pipe(concat('bunld.js')) //合并js
        .pipe(rename({
            suffix: '.min'
        })) //重命名
        .pipe(uglify()) //压缩
        .on('error', function (err) {
            gutil.log(err.toString());
        })
        .pipe(gulp.dest('js/min')) //输出
        .pipe(notify({message:"js task ok"}));    //提示
});
const platform = {
    'wind32': 'start',
    'linux': 'xdg-open',
    'darwin': 'open'
}
// 启动一个9000端口的服务
gulp.task('webserver',function(){
    connect.server({
       livereload: true,
       port: 9000
    });
    // 根据不同系统打开浏览器
    cp.exec(`${platform[process.platform]} http://localhost:9000/`)
});
// 监听文件变化自动刷新页面
gulp.task('watch',function() {
    gulp.watch('js/*.js', ['reload']);
    gulp.watch('css/*.css', ['reload']);
    gulp.watch('index.html', ['reload']);
});
// 通过connect长链接自动刷新页面
gulp.task('reload',function() {
    gulp.src(['js/*.js', 'css/*.css', 'index.html'])
    .pipe(connect.reload());
});
// 清除原文件
gulp.task('clean', function(cb) {
    del(['css/min', 'js/min'], cb)
});
console.log(process.argv);
gulp.task('default', ['webserver', 'clean', 'minifyjs', 'minifycss', 'watch'], function () {
    
});
