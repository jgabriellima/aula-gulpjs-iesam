var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
//npm install gulp-concat --save-dev
var concat = require('gulp-concat');
//npm install gulp-rename --save-dev
var rename = require('gulp-rename');
//npm install gulp-minify-html --save-dev
var minifyhtml = require('gulp-minify-html');
//npm install --save-dev gulp-minify-css
var minifyCss = require('gulp-minify-css');
//npm install --save-dev gulp-imagemin gulp-changed
var imagemin = require('gulp-imagemin');
//npm install --save-dev gulp-deploy-ftp
// var imagemin = require('gulp-deploy-ftp');
//npm install --save-dev gulp-util
var gutil = require('gulp-util');
//npm install --save-dev browser-sync
var browserSync = require('browser-sync');

var scripts = "./scripts/*.js"
var htmls = "./*.html"
var styles = "./css/*.css"
var images = "./img/**/*.jpg"

gulp.task('teste', function() {
    console.log('funcionou!');
});

//Aqui criamos uma nova tarefa através do ´gulp.task´ e damos a ela o nome 'lint'
gulp.task('lint', function() {
    // Aqui carregamos os arquivos que a gente quer rodar as tarefas com o `gulp.src`
    // E logo depois usamos o `pipe` para rodar a tarefa `jshint`
    gulp.src(scripts)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('js', function() {
    gulp.src([scripts])
        .pipe(concat('./dist'))
        .pipe(rename('dist.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});

gulp.task('html', function() {
    var opts = {
        conditionals: true,
        spare: true
    };
    gulp.src(htmls)
        .pipe(minifyhtml(opts))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('css', function() {
    gulp.src(styles)
        .pipe(concat('./dist'))
        .pipe(rename('style.min.css'))
        .pipe(minifyCss({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('jpg', function() {
    gulp.src(images)
        //Ele compara a pasta de source com a de destino e vê qual imagem realmente deve ser otimizada, para que não se perca tempo na task otimizando uma imagem que já passou por isso;
        // .pipe(changed('./dist/img/'))
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('./dist/img/'));
});


gulp.task('browser-sync', function() {
    browserSync.init(['./*.css', './scripts/*.js', './*.html'], {
        server: {
            baseDir: './',
            index: './index.html'
        }
    });
});

gulp.task('watch', ['browser-sync'], function() {
    // corpo da tarefa 
    gulp.watch(scripts, function(event) {
        gutil.log('Arquivo ' + event.path + ' foi ' + event.type + ', executando task...');
        // gulp.run('js');
    });
});

gulp.task('default', function() {
    // Usamos o `gulp.run` para rodar as tarefas
    gulp.run('lint', 'js', 'html', 'css');
    // E usamos o `gulp.watch` para o Gulp esperar mudanças nos arquivos para rodar novamente
    gulp.watch(files, function(evt) {
        gulp.run('lint', 'js', 'html', 'css');
    });
});
