const {src, dest, parallel, series, watch} = require('gulp');

const browserSync   = require('browser-sync').create();
const sass          = require('gulp-sass');
const autoprefixer  = require('gulp-autoprefixer');
const cleancss      = require('gulp-clean-css');
const imagemin      = require('gulp-imagemin');
const newer         = require('gulp-newer');
const del           = require('del');
const pug           = require('gulp-pug');
const plumber       = require('gulp-plumber');
const useref       	= require('gulp-useref');
const uglify       	= require('gulp-uglify');
const gulpif       	= require('gulp-if');
const cssmin       	= require('gulp-cssmin');
const smartGrid 		= require('smart-grid');
const gcmq = require('gulp-group-css-media-queries');
const path = require('path');

function browsersync() {
  browserSync.init({
    server: { baseDir: 'app/' },
    notify: false,
		online: true,
		tunnel: true
  })
};

function scripts() {
  return src([
		'app/js/.*js',
		'!app/js/libs'
  ])
  .pipe(browserSync.stream())
};

function template() {
  return src(['app/*.pug', '!app/template.pug'])
  .pipe(plumber())
  .pipe(pug( { pretty: true } ))
  .pipe(dest('app/'))
  .pipe(browserSync.stream())
}

function styles() {
  return src('app/sass/style.sass')
	.pipe(sass())
	.pipe(gcmq())
  .pipe(autoprefixer({ overrideBrowserlist: ['last 10 versions'], grid: true }))
  .pipe(cleancss(( { level: { 1: { specialComments: 0 } } } )))
  .pipe(dest('app/css/'))
  .pipe(browserSync.stream())
}

function images() {
  return src('app/img/**/*')
  .pipe(newer('app/img/'))
  .pipe(imagemin())
  .pipe(dest('app/img/'))
}

function cleanimg() {
  return del('app/img/**/*', { force: true })
}

function cleandist() {
  return del('dist/**/*', { force: true })
}

function grid(done){
	delete require.cache[path.resolve('./smartgrid.js')];
	let options = require('./smartgrid.js');
	smartGrid('./app/sass/libs', options);
	done();
}

function buildStatic() {
  return src([
    'app/**/*.css',
    'app/fonts/*',
    'app/img/**/*',
		], { base: 'app' })
  .pipe(dest('dist'))
}

function buildScript() {
	return src(['app/**/*.html', '!template.html'])
	.pipe(useref())
	.pipe(gulpif('*.js', uglify()))
	.pipe(gulpif('*.css', cssmin()))
  .pipe(dest('dist'))
}

function startwatch() {
  watch('app/**/*.pug', template);
  watch('app/**/*.sass', styles);
  watch('app/**/*.html').on('change', browserSync.reload);
	watch(['app/**/*js', '!app/**/*.min.js'], scripts);
	watch('./smartgrid.js', grid);
  watch('app/img/**/*', images);
};

exports.browsersync = browsersync;
exports.grid 				= grid;
exports.scripts     = scripts;
exports.styles      = styles;
exports.template    = template;
exports.images      = images;
exports.cleanimg    = cleanimg;
exports.build       = series(cleandist, styles, scripts, images, buildStatic, buildScript);

exports.default     = parallel(template, styles, scripts, browsersync, startwatch);