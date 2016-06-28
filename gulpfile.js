var gulp = require('gulp');
var gulpsass = require('gulp-sass'); //pacote node - ver documentacao (require é funcao do node)
var minifyCss  = require('gulp-minify-css'); //pacote node - ver documentacao 
var rename = require("gulp-rename");//pacote node - ver documentacao - esse muda o nome para nao salvar por cima do css.

var rimraf      = require('rimraf'); // remover recursivamente pastas, para que elas sejam substituídas
var runSequence = require('run-sequence'); // organiza as tasks numa sequencia logica
var polybuild   = require('polybuild'); // faz o css das folhas de estilo ficarem no html e gera um arquivo js para todos os js separados e faz todas as substituicoes
var gulpif = require('gulp-if'); // condicionais - testa algo para fazer uma task

var stripDebug = require('gulp-strip-debug');

var autoprefixer = require('gulp-autoprefixer'); // autoprefixer
//ver documentacoes no npmjs.com
//e la tem mil tasks
//olhar boilerplates que fizeram

//importante pacote node para essa variavel
// quando da um npm install, ele instala o pacode node no  node_modules
//gulp.task recebe 2 ou 3 argumentos. 
//o primeiro é o nome da função, 
//o segundo é ou uma function ou array (se for a function é oq ele vai executar e se for um array, é um array de functions já definidas), 
//terceira é a função desse cara mesmo.

// function para testar se o arquivo é um js (isso será usado para o stripDebbug)
var jsRe = /.+\.js$/;

function isJs(file) {
    return jsRe.test(file.path);
};


//gulp.task('oi', function(){
// 
//}).
var scssPath = ['./style/style.scss']; // ['./style/*.scss']; pegar qqr arquivo .scss que estiver dentro da pasta style

gulp.task('sass', function(done) {
     
 gulp.src(scssPath) //o arquivo que vamos modificar e queremos que ele fique ouvindo 
   .pipe(gulpsass()) //pipear o arquivo para o processo de sass - essa é a variavel definida la em cima
   .on('error', gulpsass.logError) //se der erro, faz a funcao depois da virgula - essa ja vem com o gulp sass
   .pipe(autoprefixer({
      browsers: [
      'ie >= 10',
      'ie_mob >= 10',
      'ff >= 30',
      'chrome >= 34',
      'safari >= 7',
      'opera >= 23',
      'ios >= 7',
      'android >= 4.4',
      'bb >= 10'],
      cascade: false
    }))
    .pipe(gulp.dest('./style/')) // dest salva o arquivo na pasta entre parenteses
   .pipe(minifyCss({
     keepSpecialComments: 0
   }))
   .pipe(rename({ extname: '.min.css' }))
   .pipe(gulp.dest('./style/'))
   .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(scssPath, ['sass']); //primeiro par: arquivo, segundo par: array com as tasks que quero que execute e fique executando eternamente
    
});

// task para gerar arquivo html com todo o css e um unico arquivo js
gulp.task('distribute:polybuild', function() {
  gulp.src('index.html')
    .pipe(polybuild({
      maximumCrush: true
    }))
    .pipe(gulpif(isJs, stripDebug()))
    .pipe(gulpif('index.build.html', rename('index.html')))
    .pipe(gulp.dest('dist'))
});

// task para copiar a pasta de resources para dentro de dist
gulp.task('distribute:copy', function(){
  var files = [
    'images/**/*',
  ];

  return gulp.src(files, { base: '.' })
    .pipe(gulp.dest('dist'));
});

gulp.task('distribute', function() {
  rimraf.sync('dist');

  return runSequence('sass', ['distribute:copy', 'distribute:polybuild'])
})


//gulp.task('default', ['watch']);
//caso quisesse que o comando gulp sempre fizesse o watch


//modelo:
//gulp.task('default', function() {
//  // place code for your default task here
//    
//    
//});