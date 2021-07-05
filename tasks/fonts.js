const fs = require('fs')

let srcFonts = 'src/less/_local-fonts.less'
let appFonts = 'src/fonts'
module.exports = function fonts(done) {
	fs.writeFile(srcFonts, '', () => {})
	fs.readdir(appFonts, (err, items) => {
		if (items) {
			let currentFontName;
			for (let i = 0; i< items.length; i++) {
				let fontName = items[i].split('.'),
					fontExt;
				fontExt = fontName[1]
				fontName = fontName[0]
				// if (currentFontName !== fontName) {
					if (fontExt == 'woff' || fontExt =='woff2') {
						fs.appendFile(srcFonts, `@include font-face("${fontName}", "${fontName}", 400);\r\n`, () =>{})
					}
				// 	console.log(`@include font-face("${fontName}", "${fontName}", 400);\r\n`)
				// }
				currentFontName = fontName
			}

		}
	})
	done()
}