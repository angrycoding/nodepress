(function() {

	var DELAY_BEFORE_REPEAT = 500;
	var DELAY_BETWEEN_REPEAT = 50;

	function foo(inputCount, value, isRelative) {

		var input = $('input', inputCount),
			oldValue = parseInt(input.val()),

			min = input.data('min'),
			min = (typeof min !== 'number' || isNaN(min) || !isFinite(min)) ? -Infinity : min,

			max = input.data('max'),
			max = (typeof max !== 'number' || isNaN(max) || !isFinite(max)) ? Infinity : max,

			newValue = Math.min(Math.max(isRelative ? (oldValue + value) : value, min), max),
			change = function() {
				input.val(newValue);
				inputCount.removeClass('ui-inputCount-decDisabled');
				inputCount.removeClass('ui-inputCount-incDisabled');
				if (newValue === max) inputCount.addClass('ui-inputCount-incDisabled');
				if (newValue === min) inputCount.addClass('ui-inputCount-decDisabled');
				inputCount.trigger('ui-change', [oldValue, newValue, inputCount.data('data')]);
			};

		if (newValue !== oldValue) {
			var event = jQuery.Event('ui-beforeChange');
			inputCount.trigger(event, [function(result) {
				if (result) change();
			}, oldValue, newValue, inputCount.data('data')]);
			if (event.result !== true) change();
		}

	}

	var documentRef = $(document);

	documentRef.on('ui-disable', '.ui-inputCount', function() {
		$(this).addClass('ui-disabled');
	});

	documentRef.on('ui-enable', '.ui-inputCount', function() {
		$(this).removeClass('ui-disabled');
	});

	documentRef.on('ui-setValue', '.ui-inputCount', function(event, value) {
		foo($(this), value);
	});

	var repeatTimer;


	documentRef.on('mousedown', '.ui-inputCount-value', false);

	documentRef.on('mousedown', '.ui-inputCount-dec', function() {

		var inputCount = $(this).closest('.ui-inputCount');
		if (inputCount.is('.ui-disabled, .ui-inputCount-decDisabled')) return false;
		foo(inputCount, -1, true);

		if (inputCount.is('.ui-inputCount-repeat')) {
			repeatTimer = setTimeout(function() {
				repeatTimer = setInterval(function() {
					foo(inputCount, -1, true);
				}, DELAY_BETWEEN_REPEAT);
			}, DELAY_BEFORE_REPEAT);
		}

		return false;
	});

	documentRef.on('mousedown', '.ui-inputCount-inc', function(event) {

		var inputCount = $(this).closest('.ui-inputCount');
		if (inputCount.is('.ui-disabled, .ui-inputCount-incDisabled')) return false;
		foo(inputCount, 1, true);

		if (inputCount.is('.ui-inputCount-repeat')) {
			repeatTimer = setTimeout(function() {
				repeatTimer = setInterval(function() {
					foo(inputCount, 1, true);
				}, DELAY_BETWEEN_REPEAT);
			}, DELAY_BEFORE_REPEAT);
		}

		return false;
	});

	documentRef.on('mouseup mouseout', '.ui-inputCount-inc, .ui-inputCount-dec', function() {
		clearTimeout(repeatTimer);
		clearInterval(repeatTimer);
	});

})();