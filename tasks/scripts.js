const {src, dest} = require('gulp');

const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;

module.exports = function scripts() {
	return src([
		'node_modules/jquery/dist/jquery.js',
		'app/js/main.js',
	]).
		pipe(concat('main.min.js')).
		pipe(uglify()).
		pipe(dest('app/js')).
		pipe(browserSync.stream());
};
