const {src, dest} = require('gulp');
const imagemin = require('gulp-imagemin');

module.exports = function images() {
	return src('src/images/**/*').pipe(imagemin(
		[
			imagemin.gifsicle({interlaced: true}),
			imagemin.mozjpeg({quality: 75, progressive: true}),
			imagemin.optipng({optimizationLevel: 5}),
			imagemin.svgo({
				plugins: [
					{removeViewBox: true},
					{cleanupIDs: false},
				],
			}),
		],
	)).pipe(dest('build/images'));
};