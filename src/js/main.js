document.addEventListener('DOMContentLoaded', () => {

	const getRandomString = (length = 7) => {
		return Math.random().toString(36).substring(length);
	};
	//	create floating placeholders
	const handleFloatingPlaceholders = () => {
		const createFloatingPlaceholder = (el) => {

			const text = el.dataset.placeholder;
			if (text === undefined) return;

			const placeholder = document.createElement('label');
			placeholder.for = el.name;
			placeholder.textContent = text;
			placeholder.classList.add('floating-placeholder');
			el.parentElement.prepend(placeholder);
			el.placeholderEl = placeholder;
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
		elementsWithPlaceholder.forEach(el => createFloatingPlaceholder(el));

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
		birthYearSelect.prepend(expandIcon);

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
			ul.append(li);
		}
		birthYearSelect.prepend(ul);

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

			const indicator = document.createElement('img');
			indicator.src = 'images/svg/checked.svg';
			indicator.alt = '';
			indicator.classList.add('custom-checkbox__indicator');
			checkbox.checked = false;
			checkbox.append(indicator);

			const label = document.createElement('label');
			label.setAttribute('for', id);
			label.className = 'custom-checkbox__label';
			label.textContent = el.dataset.label;

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

			parent.append(checkbox);
			parent.append(label);
		};

		const elements = document.querySelectorAll('[data-custom-checkbox]');
		elements.forEach(item => createCustomCheckBox(item));
	};
	handleCustomCheckboxes();

	const getRelativePercentage = (val, target) => {
		const onePercent = target / 100;
		return (target - (target - val)) / onePercent;
	};

	const getFromPercentages = (percentages, target) => {
		return target / 100 * percentages;
	};

	const isCloserToUpper = (curr, upperValue, lowerValue) => {
		let lowerCount, higherCount
		higherCount = lowerCount = 0
		for (let i = curr; i <= upperValue; i++,higherCount++) {}
		for (let i = curr; i >= lowerValue; i--,lowerCount++) {}
		return higherCount > lowerCount
	};


	getDashesAmount = (point) => {
		const points =new Map([
			[ 0, {dashes: 7, markerHeight: 0}],
			[ 25, {dashes:6, markerHeight: 6}],
			[ 50, {dashes:5, markerHeight: 9}],
			[ 75, {dashes:4, markerHeight: 11}],
			[ 100, {dashes:3, markerHeight: 14}],
		]);
		console.log(points, point)
		return (points.get(Number(point)))
	};

	const handleJSLevelRange = () => {
		const range = document.querySelector('[data-range]');
		const rangeControl = range.querySelector('.range__control');
		const rangeControlContainer = range.querySelector(
			'.range__control-container');
		const rangeGradients = document.querySelectorAll('.range__gradient');
		const initialValuePercentages = range.dataset.rangeStart;
		const rangeWidth = range.offsetWidth;

		const createPoints = () => {
			const points = range.querySelectorAll('[data-point]');
			points.forEach(point => {
				let orientationAdditionClass = ''
				let textAdditionClass = ''
				let markerAdditionalClass = ''
				let offsetLeft = getFromPercentages(point.dataset.point,
					rangeWidth);
				if (offsetLeft === rangeWidth) {
					point.classList.add('range__point--right')
				    orientationAdditionClass = 'range__point-orientation--right'
					textAdditionClass = 'range__point-text--right'
					markerAdditionalClass = 'range__point-marker--right'
				} else {
					point.style.left = offsetLeft + 'px';
				}

				const orientation = document.createElement('div');
				orientation.className = 'range__point-orientation ' + orientationAdditionClass;

				const {dashes: dashesAmount, markerHeight} = getDashesAmount(point.dataset.point);
				const dashes = document.createElement('div');
				dashes.className = 'range__point-dashes';
				dashes.style.height = dashesAmount * 2 + 'px'
				for (let i = 0; i < dashesAmount; i++) {
					const dash = document.createElement('span')
					dash.className = 'range__point-dash'
					dashes.append(dash)
				}
				orientation.append(dashes)

				const marker = document.createElement('div');
				marker.className = 'range__point-marker ' + markerAdditionalClass;
				marker.style.height = markerHeight + 'px'
				orientation.append(marker)

				const text = document.createElement('p')
				text.className = 'range__point-text ' + textAdditionClass
				text.textContent = point.dataset.text
				point.append(text)
				point.append(orientation)
			});
		};
		createPoints();

		const setValues = (direction, v, step) => {
			rangeGradients.forEach(gradient => {
				if (direction === 'up') {
					gradient.style.width = v + 'px';
				} else if (direction === 'down') {
					gradient.style.width = v + 'px';
				}
			});

			if (direction === 'up') {
				rangeControl.style.left = v + 'px';
				v += step;

			} else if (direction === 'down') {
				rangeControl.style.left = v + 'px';
				v -= step;
			}
		};

		const changeValues = (e, step = 1, ms = 50) => {
			const coords = e.target.getBoundingClientRect();
			const v = e.pageX - coords.x;
			const goal = v;
			const initial = rangeControl.style.left.replace('px', '');
			const direction = goal > initial ? 'up' : 'down';

			let i = setInterval(() => {
				setValues(direction, v, step);
				const current = v;
				if (current === goal) {
					clearInterval(i);
					return current;
				}
			}, ms);

		};
		const delay = (fn, ms) => {
			return function() {
				if (Date.now() < delay.nextPossibleCallDate) {
					return;
				}
				fn(...arguments);
				delay.nextPossibleCallDate = Date.now() + ms;
			};

		};
		const mouseDownHandler = function(e) {
			changeValues(e);
			const mouseMoveHandler = (e) => {
				changeValues(e);
			};
			const mouseUpHandler = (e) => {
				range.removeEventListener('mousemove', mouseMoveHandler);
				setTimeout(
					() => range.removeEventListener('mouseup', mouseUpHandler));
			};

			const mouseOutHandler = (e) => {
				range.removeEventListener('mousemove', mouseMoveHandler);
				range.removeEventListener('mouseup', mouseUpHandler);
			};
			range.addEventListener('mouseout', mouseOutHandler);
			range.addEventListener('mousemove', mouseMoveHandler);
			range.addEventListener('mouseup', mouseUpHandler);
		};

		range.addEventListener('mousedown', mouseDownHandler);

		const initialPosition = getFromPercentages(initialValuePercentages,
			rangeWidth);
		rangeControl.style.setProperty('left', initialPosition + 'px');
		rangeGradients.forEach(
			(item) => item.style.setProperty('width', initialPosition + 'px'));
	};
	handleJSLevelRange();
});