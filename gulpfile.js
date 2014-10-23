var path = require('path');

var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var liveReload = require('gulp-livereload');
var uglify = require('gulp-uglify');
var cond = require('gulp-cond');

var gbro = require('gulp-browserify');
var reactify = require('reactify');
var envify = require('envify');


var rename = require('gulp-rename');

var log = console.log;

function errHandler(err){
    gutil.beep();
    log('err reported by: ', err.plugin);
    log('\tfile:  ', err.fileName);
    log('\tline:  ', err.lineNumber);
    log('\tstack: ', err.stack);
    log('*************************');
    log(err);
}

var productTasks = [undefined, 'default'];
var proEnv = false;

var bundleTask = 'bundle-gulp-browserify';
var scriptPath = 'assets/js/chat';
var appPath = path.join(scriptPath, 'app.js');

var taskName = (process.argv[0] === 'node')? process.argv[2] : process.argv[1];
if( productTasks.indexOf(taskName) >= 0 ){
    proEnv = true;
}



gulp.task('bundle-gulp-browserify', function(){
    gulp.src(appPath)
        .pipe(plumber({errorHandler: errHandler}))
        .pipe(gbro({
            transform: [reactify, envify],
            debug: !proEnv
        }))
        .pipe(rename('bundle.js'))
        .pipe(cond(proEnv, uglify()) )
        .pipe(gulp.dest(scriptPath));
});

gulp.task('watch', function(){
    // gulp-livereload module updated... 
    liveReload.listen();

    var file2w = [path.join(scriptPath, '**/*.js'), '!' + path.join(scriptPath, 'bundle.js')];
    gulp.watch(file2w, [bundleTask]);
});

gulp.task('default', [ bundleTask ]);

gulp.task('wd', [bundleTask, 'watch']);