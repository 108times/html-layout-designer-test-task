// connect jquery & clip-path to create polyfill for css clip-path property
// if run on ie11

document.addEventListener('DOMContentLoaded', () => {
	const isIE11 = () => {
		return !!window.MSInputMethodContext && !!document.documentMode;
		// return true
	};

	// function for changing range position
	const isMobile = () => document.body.offsetWidth < 768;


	if (isIE11()) {
		const handler = () => {
			const createFillPolyfill = options => {
				const replacerTop = document.createElement('img');
				replacerTop.className = options.className;
				replacerTop.setAttribute('src', options.src);
				replacerTop.setAttribute('width', options.width);
				replacerTop.setAttribute('height', options.height);
				replacerTop.setAttribute('alt', options.alt || '');
				replacerTop.setAttribute('data-polyclip', options.polyclip);

				options.container.appendChild(replacerTop);
				return replacerTop;
			};

			const createBottomPart = options => {
				const bottom = document.createElement('div');
				bottom.className = options.className;
				options.container.appendChild(bottom);
				return bottom;
			};

			const range = document.querySelector('.range__scale');
			range.innerHTML = '';
			range.classList.add('polyfill');

			// const rangeTop = document.querySelector('.range__scale-top');
			const rangeTop = document.createElement('div');
			rangeTop.className = 'polyfill__upper';

			const rangeBottom = document.createElement('div');
			rangeBottom.className = 'polyfill__bottom';

			range.appendChild(rangeTop);
			range.appendChild(rangeBottom);

			const triangleGradient = createFillPolyfill({
				src: 'images/gradient.png',
				width: '768',
				height: '11',
				alt: '',
				polyclip: '100%, 0, 100%, 100%, 0%, 100%',
				className: 'plyfill__img',
				container: rangeTop,
			});

			const triangleGray = createFillPolyfill({
				src: 'images/gray.png',
				width: '768',
				height: '11',
				alt: '',
				polyclip: '100%, 0, 100%, 100%, 0%, 100%',
				className: 'polyfill__img',
				container: rangeBottom,
			});

			const bottomGradient = createBottomPart({
				className: 'polyfill__upper-bottom',
				container: rangeTop,
			});

			const bottomGray = createBottomPart({
				className: 'polyfill__bottom-bottom',
				container: rangeBottom,
			});

			const rangeControl = document.querySelector('.range__control')
			setTimeout(() => rangeTop.style.maxWidth = document.querySelector('[data-range]').dataset.rangeStart + '%',1000)

			window.setValues = (direction, v, step) => {
				rangeTop.style.maxWidth = v + 'px'

				if (direction === 'up') {
					rangeControl.style.left = v + 'px';
					v += step;

				} else if (direction === 'down') {
					rangeControl.style.left = v + 'px';
					v -= step;
				}
			}
			console.log(isMobile())

			// if (isMobile()) {
			// 	setTimeout(() => {
			// 		const canvasList = document.querySelectorAll('.polyClip-clipped');
			// 		console.log(canvasList);
			// 		[...canvasList].forEach(canvas => {
			// 			canvas.setAttribute('width', '768')
			// 			console.log(canvas)
			// 		})
			// 	}, 50)
			//
			// }

		};

		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = 'js/libs.min.js';
		document.getElementsByTagName('head')[ 0 ].appendChild(script);
		script.onload = () => {

			handler();

		};
	}

	//	create floating placeholders
	const handleFloatingPlaceholders = () => {
		const createFloatingPlaceholder = (el) => {

			const text = el.dataset.placeholder;
			if (text === undefined) return;

			const placeholder = document.createElement('label');
			placeholder.for = el.name;
			placeholder.textContent = text;
			placeholder.classList.add('floating-placeholder');
			// el.parentElement.prepend(placeholder);
			el.parentElement.insertBefore(placeholder,
				el.parentElement.childNodes[ 0 ]);
			el.placeholderEl = placeholder;

			if (el.value !== '') {
				placeholder.classList.add('focus');
				el.classList.add('has-value');

			}
			el.addEventListener('focus', e => {
				placeholder.classList.add('focus');
			});
			const onFloatingLabelBlur = e => {
				placeholder.classList.remove('focus');
				el.classList.remove('has-value');
			};
			el.addEventListener('blur', e => {
				if (el.value === undefined || el.value === '') {
					onFloatingLabelBlur(e);
				} else {
					el.classList.add('has-value');
				}
			});
		};
		const elementsWithPlaceholder = document.querySelectorAll(
			'[data-placeholder]');
		[...elementsWithPlaceholder].forEach(
			el => createFloatingPlaceholder(el));

	};
	handleFloatingPlaceholders();

	// birthyear select
	const handleBirthYearSelect = () => {
		const birthYearSelect = document.querySelector('[data-select-year]');
		birthYearSelect.classList.add('birthyear-select');

		// insert icon
		const expandIcon = document.createElement('img');
		expandIcon.src = 'images/svg/expand-list.svg';
		expandIcon.alt = 'expand-birthyear-list';
		expandIcon.classList.add('birthyear-select__icon');
		birthYearSelect.insertBefore(expandIcon,
			birthYearSelect.childNodes[ 0 ]);

		// get input
		const input = birthYearSelect.querySelector('input');
		input.classList.add('birthyear-select__input');
		input.readOnly = 'readonly';

		// insert list
		const ul = document.createElement('ul');
		ul.classList.add('birthyear-select__list');
		const min = birthYearSelect.dataset.yearStart || 1970;
		const max = birthYearSelect.dataset.yearEnd || 2003;
		for (let i = max; i >= min; i--) {
			const li = document.createElement('li');
			li.classList.add('birthyear-select__list-item');
			li.textContent = i;
			li.onclick = e => {

				input.value = i;
				input.classList.add('has-value');
				input.placeholderEl.classList.add('focus');

			};
			ul.appendChild(li);
		}
		birthYearSelect.insertBefore(ul, birthYearSelect.childNodes[ 0 ]);

		const openSelection = e => {
			e.preventDefault();
			expandIcon.classList.add('birthyear-select__icon-rotated');
			ul.classList.add('shown');
		};
		const closeSelection = e => {
			expandIcon.classList.remove('birthyear-select__icon-rotated');
			ul.classList.remove('shown');
		};
		// add handlers
		input.addEventListener('focus', e => openSelection(e));

		expandIcon.addEventListener('focus', e => openSelection(e));

		expandIcon.addEventListener('blur', e => closeSelection(e));

		input.addEventListener('blur', e => closeSelection(e));

	};
	handleBirthYearSelect();

	// custom checkboxes
	const handleCustomCheckboxes = () => {
		const getRandomString = (length = 7) => {
			return Math.random().toString(36).substring(length);
		};

		const createCustomCheckBox = (el) => {
			const parent = el.parentElement;
			el.hidden = 'hidden';
			const id = el.id || (() => {
				const newId = getRandomString();
				el.setAttribute('id', newId);
				return newId;
			})();
			const checkbox = document.createElement('span');
			checkbox.classList.add('custom-checkbox');
			checkbox.setAttribute('tabIndex', '0');

			//
			const indicator = document.createElement('img');
			indicator.src = 'images/svg/checked.svg';
			indicator.alt = '';
			indicator.classList.add('custom-checkbox__indicator');
			checkbox.checked = false;
			checkbox.appendChild(indicator);

			const label = document.createElement('label');
			label.setAttribute('for', id);
			label.className = 'custom-checkbox__label';
			label.textContent = el.dataset.label;

			if (el.checked === true) {
				checkbox.classList.add('custom-checkbox--checked');
				indicator.classList.add(
					'custom-checkbox__indicator--visible');
			}

			checkbox.addEventListener('click', () => {
				const checked = checkbox.checked;

				if (!checked) {
					checkbox.classList.add('custom-checkbox--checked');
					indicator.classList.add(
						'custom-checkbox__indicator--visible');
					el.setAttribute('checked', true);
				} else {
					checkbox.classList.remove('custom-checkbox--checked');
					indicator.classList.remove(
						'custom-checkbox__indicator--visible');
					el.setAttribute('checked', false);
				}

				checkbox.checked = !checked;

			});

			parent.appendChild(checkbox);
			parent.appendChild(label);
		};

		const elements = document.querySelectorAll('[data-custom-checkbox]');
		[...elements].forEach(item => createCustomCheckBox(item));
	};
	handleCustomCheckboxes();

	// js range
	const handleJSLevelRange = () => {
		const getRelativePercentage = (val, target) => {
			const onePercent = target / 100;
			return (target - (target - val)) / onePercent;
		};
		// javascript section range
		const delay = (fn, ms) => {
			return function() {
				if (Date.now() < delay.nextPossibleCallDate) {
					return;
				}
				fn(...arguments);
				delay.nextPossibleCallDate = Date.now() + ms;
			};

		};
		const getFromPercentages = (percentages, target) => {
			return target / 100 * percentages;
		};
		const getDashesAmount = (point, points) => {
			point = Number(point);
			const v = points.get(point);
			if (v) {
				points.set(point, {...v, isUsed: true});
			}
			return v;
		};

		const setRangePosition = function(
			e, el, step = 1, ms = 50, absoluteValue = null) {
			let v;
			// if value is provided then just move to it

			if (absoluteValue !== null) {
				v = absoluteValue;
			} else {
				const coords = el.getBoundingClientRect();
				v = e.pageX - coords.left;
			}
			const goal = v;
			const initial = rangeControl.style.left.replace('px', '');
			const direction = goal > initial ? 'up' : 'down';
			let i = setTimeout(function handler() {
				window.setValues ? window.setValues(direction, v, step) : setValues(direction, v, step);
				const current = v;
				if (current === goal) {
					clearTimeout(i);
					mouseDownHandler.current = current;
					touchStartHandler.current = current;
				} else {
					i = setTimeout(handler, ms);
				}

			}, ms);

		};

		const points = new Map([
			[0, {dashes: 7, markerHeight: 0, ie11Top: 21}],
			[24, {dashes: 6, markerHeight: 6, ie11Top: 7}],
			[50, {dashes: 5, markerHeight: 9, ie11Top: 5}],
			[75, {dashes: 4, markerHeight: 11, ie11Top: 5}],
			[100, {dashes: 3, markerHeight: 14, ie11Top: 23}],
		]);

		const range = document.querySelector('[data-range]');
		const rangeControl = range.querySelector('.range__control');
		const rangeControlContainer = range.querySelector(
			'.range__control-container');
		const rangeGradients = document.querySelectorAll('.range__gradient');
		const rangeGradientsFills = document.querySelectorAll(
			'.range__gradient-fill');
		const initialValuePercentages = range.dataset.rangeStart;
		const rangeWidth = range.querySelector('.range__scale-top').offsetWidth;

		const createPoints = (pointsData) => {
			const pointsContainer = range.querySelector('.range__points');

			if (isIE11()) {
				pointsContainer.style[ 'align-items' ] = 'flex-start';
			}

			const points = range.querySelectorAll('[data-point]');

			[...points].forEach(point => {
				let orientationAdditionClass = '';
				let textAdditionClass = '';
				let markerAdditionalClass = '';
				let offsetLeft = getFromPercentages(point.dataset.point,
					rangeWidth);
				if (offsetLeft === rangeWidth) {

					point.classList.add('range__point--right');
					if (isMobile()) {

						setTimeout(() => {

							point.style.right = '0';
							point.style.left = offsetLeft + 2 + 'px';
							point.style.top = '44px'
							point.querySelector(
								'.range__point-text ').style.cssText = 'position: absolute; left: -152px; ;width:180px;' + (!isIE11() ? 'top:0px' : 'top:-20px')
						});
					}

					orientationAdditionClass = 'range__point-orientation--right';
					textAdditionClass = 'range__point-text--right';
					markerAdditionalClass = 'range__point-marker--right';
				} else {
					point.style.left = offsetLeft + 'px';
				}

				const orientation = document.createElement('div');
				orientation.className = 'range__point-orientation ' +
					orientationAdditionClass;

				const {dashes: dashesAmount, markerHeight, ie11Top} = getDashesAmount(
					point.dataset.point, pointsData);

				if (isIE11()) {
					point.style.top = ie11Top + 'px'
				}

				const dashes = document.createElement('div');
				dashes.className = 'range__point-dashes';
				dashes.style.height = dashesAmount * 2 + 'px';
				for (let i = 0; i < dashesAmount; i++) {
					const dash = document.createElement('span');
					dash.className = 'range__point-dash';
					dashes.appendChild(dash);
				}
				orientation.appendChild(dashes);

				const marker = document.createElement('div');
				marker.className = 'range__point-marker ' +
					markerAdditionalClass;
				marker.style.height = markerHeight + 'px';
				orientation.appendChild(marker);

				const text = document.createElement('p');
				text.className = 'range__point-text ' + textAdditionClass;
				text.textContent = point.dataset.text;
				point.appendChild(text);
				point.appendChild(orientation);
			});
		};
		createPoints(points);

		const setValues = (direction, v, step) => {
			console.log(v);
			[...rangeGradientsFills].forEach(fill => {
				fill.style.width = rangeWidth - v + 'px';
			});

			if (direction === 'up') {
				rangeControl.style.left = v + 'px';
				v += step;

			} else if (direction === 'down') {
				rangeControl.style.left = v + 'px';
				v -= step;
			}
		};

		const isCloserToUpper = (curr, upperValue, lowerValue) => {
			let lowerCount, higherCount;
			higherCount = lowerCount = 0;
			for (let i = curr; i <= upperValue; i++, higherCount++) {}
			for (let i = curr; i >= lowerValue; i--, lowerCount++) {}
			return higherCount > lowerCount;
		};

		const moveToNearestPoint = (e, curr, points) => {
			// push all offset values into array
			const diffArray = [];
			points.reduce((previous, current) => {
				let currentDifference = current - curr;
				diffArray.push({
					value: currentDifference,
					absValue: Math.abs(currentDifference),
					point: current,
				});
				return current;
			}, points[ 0 ]);

			// find min offset
			let min;
			[...diffArray].forEach(item => {
				if (min === undefined
					|| item.absValue < min.absValue) min = item;
			});
			setTimeout(() => setRangePosition(null, null, 1, 400, min.point), 200);
		};

		const assignValuesAccordingToPercentages = (arr, width) => {
			return [...arr].map(i => getFromPercentages(i, width));
		};
		const removeUnusedElements = (points) => {
			for (const entry of points) {
				if (entry[ 1 ].isUsed === undefined) {
					points.delete(entry[ 0 ]);
				}
			}
			return points;
		};

		const mouseDownHandler = function(e) {

			const mouseMoveHandler = (e) => {
				setRangePosition(e, rangeControlContainer);
			};
			const mouseUpHandler = (e) => {
				rangeControlContainer.removeEventListener('mousemove',
					mouseMoveHandler);
				setTimeout(() => {
					rangeControlContainer.removeEventListener('mouseup',
						mouseUpHandler);
					moveToNearestPoint(e, mouseDownHandler.current,
						assignValuesAccordingToPercentages(
							removeUnusedElements(points).keys(),
							rangeWidth));
				});
			};

			const mouseOutHandler = (e) => {
				setTimeout(() => {
					if (e.target === range) {
						rangeControlContainer.removeEventListener('mousemove',
							mouseMoveHandler);
					}
					// rangeControlContainer.removeEventListener('mouseup', mouseUpHandler);

				});
			};

			range.addEventListener('mouseout', mouseOutHandler);
			rangeControlContainer.addEventListener('mousemove',
				mouseMoveHandler);
			rangeControlContainer.addEventListener('mouseup', mouseUpHandler);
		};

		const touchEndHandler = function(e) {
			moveToNearestPoint(e, touchStartHandler.current,
				assignValuesAccordingToPercentages(
					removeUnusedElements(points).keys(),
					rangeWidth));
		};

		const touchStartHandler = function(e) {
			const offsetLeft = (e.changedTouches[ 0 ].pageX + range.scrollLeft);
			setRangePosition(null, null, 1, 50, offsetLeft);

		};
		rangeControl.addEventListener('mousedown', mouseDownHandler);
		range.addEventListener('touchmove', touchStartHandler);
		range.addEventListener('touchstart', touchStartHandler);
		range.addEventListener('touchend', touchEndHandler);

		const setInititalPosition = () => {
			const initialPosition = getFromPercentages(initialValuePercentages,
				rangeWidth);
			rangeControl.style.setProperty('left', initialPosition + 'px');
			[...rangeGradientsFills].forEach(
				(item) => item.style.setProperty('width',
					initialPosition + 'px'));
		};
		setInititalPosition();

	};
	handleJSLevelRange();

	/*
	// menu
	// const handleMenu = () => {
	// 	const menu = document.querySelector('[data-menu]')
	// 	const menuItems = document.querySelectorAll('.menu__item')
	// 	const menuLinks = menu.querySelectorAll('.menu__link')
	// 	let containers = []
	// 	menuLinks.forEach(link => {
	// 		const href = link.getAttribute('href')
	// 		containers.push(document.querySelector( href))
	//
	// 		link.addEventListener('click', (e) => {
	// 			e.preventDefault()
	// 			containers.forEach(item => item.classList.remove('active'))
	// 			menuItems.forEach(item => item.classList.remove('active'))
	// 			link.closest('.menu__item').classList.add('active')
	// 			document.querySelector( href).classList.add('active')
	// 		})
	//
	// 	})
	// }
	// handleMenu()
	*/

	//mobile menu
	const handleMenuMobile = () => {
		const hamburger = document.querySelector('.menu-hamburger');
		const h_top = hamburger.firstElementChild;
		const h_bottom = h_top.nextElementSibling;

		const menu = document.querySelector('.menu__list');
		const menuItems = document.querySelectorAll('.menu__item');
		const menuLinks = menu.querySelectorAll('.menu__link');

		const hamburgerTurnList = () => {
			hamburger.classList.remove('x');
			h_top.classList.add('collapse');
			h_bottom.classList.add('collapse');
			h_top.classList.remove('rotate');
			h_bottom.classList.remove('rotate');
			setTimeout(() => {
				h_top.classList.remove('collapse');
				h_bottom.classList.remove('collapse');
			}, 200);
		};

		const hamburgerTurnX = () => {
			hamburger.classList.add('x');
			h_top.classList.add('collapse');
			h_bottom.classList.add('collapse');
			setTimeout(() => {
				h_top.classList.add('rotate');
				h_bottom.classList.add('rotate');
				h_top.classList.remove('collapse');
				h_bottom.classList.remove('collapse');
			}, 200);

		};

		const showMenu = () => {
			hamburgerTurnX();
			setTimeout(() => menu.classList.add('menu__list--visible'), 200);
		};

		const hideMenu = () => {
			hamburgerTurnList();
			setTimeout(() => menu.classList.remove('menu__list--visible'), 200);
		};
		hamburger.addEventListener('click', e => {
			if (!menu.classList.contains('menu__list--visible')) {
				return showMenu();
			}
			return hideMenu();
		});

		[...menuLinks].forEach(link => {
			link.addEventListener('click', () => {
				hideMenu();
				[...menuItems].forEach(item => item.classList.remove('active'));
				link.parentNode.classList.add('active');

			});
		});
	};
	handleMenuMobile();
});