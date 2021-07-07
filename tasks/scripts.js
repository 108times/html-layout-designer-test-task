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
		'src/js/main.js',
	]).
		pipe(sourcemaps.init()).
		pipe(babel({
			"presets": [
				[ "@babel/preset-env"]
			]
		})).
		pipe(uglify({mangle: true})).

		pipe(terser({mangle: true})).
		pipe(sourcemaps.write()).
		pipe(rename({suffix: '.min'})).
		pipe(dest('src/js'));
	// pipe(concat('main.min.js')).
	// pipe(uglify()).
	// pipe(dest('src/js')).

};
