const { src, dest, watch, parallel, series }  = require('gulp');

const requireDir = require('require-dir')
const concat        = require('gulp-concat');
const browserSync   = require('browser-sync').create();
const del           = require('del');

const {images, scripts, styles} = requireDir('./tasks')

function browsersync() {
	browserSync.init({
		server : {
			baseDir: 'src/'
		}
	});
}

function cleanDist() {
	return del('dist')
}

function build() {
	return src([
		'src/css/style.min.css',
		'src/fonts/**/*',
		'src/js/main.min.js',
		'src/*.html'
	], {base: 'src'})
	.pipe(dest('dist'))
}

function watching() {
	watch(['src/scss/**/*.scss'], styles);
	watch(['src/js/**/*.js', '!src/js/main.min.js'], scripts);
	watch(['src/*.html']).on('change', browserSync.reload);
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;


exports.build = series(cleanDist, images, build);
exports.default = parallel(styles ,scripts ,browsersync, watching);


