const {src, dest} = require('gulp');

const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync')

module.exports = function scripts() {
	return src([
		'src/js/main.js'
	]).
		pipe(concat('main.min.js')).
		pipe(uglify()).
		pipe(dest('src/js')).
		pipe(browserSync.stream());
};
