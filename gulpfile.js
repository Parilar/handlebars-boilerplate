let gulp = require('gulp');
let plugins = require('gulp-load-plugins');
let browserSync = require('browser-sync');
let del = require('del');

let FtpDeploy = require('ftp-deploy');
let ftpDeploy = new FtpDeploy();
ftpDeploy.on('uploaded', function (data) {
    console.log("upload "+data.filename+" done | progress :  "+data.transferredFileCount+" / "+data.totalFilesCount);
});
ftpDeploy.on('upload-error', function (data) {
    console.log("upload-error:"+data.err);
});

function reload(done) {
    browserSync.reload();
    done();
}

const $ = plugins();

gulp.task('clean', del.bind(null, ['docs/dist', 'dist']));

function copyCss(){
    return gulp.src(['src/css/**/*'])
        .pipe(gulp.dest('dist/css'));
}
function copyImage(){
    return gulp.src(['./src/img/**/*'])
        .pipe(gulp.dest('./dist/img'));
}
function copyFont(){
    return gulp.src(['src/fonts/**/*'])
        .pipe(gulp.dest('dist/fonts'));
}
function copyHtml(){
    return gulp.src(['src/*.html'])
        .pipe(gulp.dest('dist'));
}

function compileTpl(){
    let namespace = process.argv[4];
    if(namespace == undefined){
        namespace = "Templates"
    }
    return gulp.src('src/tpl/**/*.handlebars')
        .pipe($.handlebars())
        .pipe($.wrap('Handlebars.template(<%= contents %>)'))
        .pipe($.declare({
            namespace: namespace,
            noRedeclare: true, // Avoid duplicate declarations
            processName: function(filePath) {
                return $.declare.processNameByPath(filePath.replace('src\\tpl\\', ''));
            }
        }))
        .pipe($.concat('templates.js'))
        .pipe($.minify({ext:{
                src:'',
                min:'.min.js'
            }}))
        .pipe(gulp.dest('dist/js/'));
}

gulp.task('compileTpl', () => {
    return compileTpl();
});

gulp.task('copy', gulp.parallel(copyCss, copyImage, copyFont, copyHtml, compileTpl));

gulp.task('copyHtml', () => {
    return gulp.src(['src/*.html'])
        .pipe(gulp.dest('dist'));
});

// Build LibSass files
gulp.task('styles', function() {
    return gulp.src('src/scss/*.scss')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'))
        .pipe($.minifyCss())
        .pipe(gulp.dest('dist/css'));
});

// Build JavaScript files
//TODO: compile JavaScript files
gulp.task('scripts', function() {
    return gulp.src(['src/js/**/*'])
        .pipe(gulp.dest('dist/js'));
});


gulp.task('watch', function() {
    browserSync.init({
        server: "./dist"
    });
    gulp.watch('src/scss/**/*.scss', gulp.series('styles', reload));
    gulp.watch('src/js/**/*.js', gulp.series('scripts', reload));
    gulp.watch("src/tpl/**/*.handlebars", gulp.series('compileTpl', reload));
    gulp.watch("src/*.html", gulp.series('copyHtml', reload));
});

gulp.task('dist', gulp.series('copy', 'styles', 'scripts'));