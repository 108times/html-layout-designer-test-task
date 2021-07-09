const {src, dest, watch, parallel, series} = require('gulp');

const requireDir = require('require-dir');
const browserSync = require('browser-sync').create();
const del = require('del');

const {images, scripts, styles, ttf, fonts, ttf_prod, libs} = requireDir('./tasks');

function browsersync() {
	browserSync.init({
		server: {
			baseDir: 'src/',
		},
	});
}

function cleanDist() {
	return del('dist');
}

function build() {
	return src([
		'src/css/style.min.css',
		'src/fonts/**/*',
		'src/js/**/*.js',
		'src/*.html',
	], {base: 'src'}).pipe(dest('build'));
}

function watching() {
	watch(['src/fonts/**/*.ttf'], series(ttf, fonts));
	watch(['src/less/**/*.less'], styles);
	watch(['src/js/**/*.js', '!src/js/main.min.js'], scripts);
	watch(['src/css/*.css']).on('change', browserSync.reload);
	watch(['src/js/*.js']).on('change', browserSync.reload);
	watch(['src/*.html']).on('change', browserSync.reload);
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;
exports.fonts = fonts
exports.libs = libs

exports.build = series(cleanDist, images, ttf_prod, build);
exports.default = parallel(styles, libs, scripts, browsersync, watching);


