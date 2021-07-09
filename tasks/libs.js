const {src, dest} = require('gulp');

const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync');

const babel = require('gulp-babel');
const terser = require('gulp-terser');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');

module.exports = function scripts() {
	return src([
		'node_modules/jquery/dist/jquery.js',
		'node_modules/clip-path-polyfill/clip-path-polyfill.js'
	]).
		pipe(concat('libs.js')).

		pipe(sourcemaps.init()).

		pipe(uglify({mangle: true})).
		// pipe(babel({
		// 	presets: [
		// 		'@babel/preset-env',
		// 	]
		// })).
		//
		// pipe(terser({mangle: true})).

		pipe(sourcemaps.write()).

		pipe(rename({suffix: '.min'})).
		pipe(dest('src/js'));

};
