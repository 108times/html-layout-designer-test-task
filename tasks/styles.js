const { src, dest } = require('gulp')

const map = require('gulp-sourcemaps')
const less = require('gulp-less')
const concat = require('gulp-concat')
const LessAutoprefix = require('less-plugin-autoprefix')
const autoprefix = new LessAutoprefix({ browsers: [
		'Android >= 4',
		'Chrome >= 20',
		'Firefox >= 24',
		'Explorer >= 11',
		'iOS >= 6',
		'Opera >= 12',
		'Safari >= 6',]})
const clean = require('gulp-clean-css')
const bs = require('browser-sync');

module.exports = function style(cb) {
	return src('./src/less/style.less')
	.pipe(map.init())
	.pipe(less({
		plugins: [autoprefix]
	}))
	.pipe(clean({
		level: 2
	}))
	.pipe(concat('style.min.css'))
	.pipe(map.write())
	.pipe(dest('./build/css/'))
	.pipe(bs.stream())
	cb()
}
