(function() {

	$(document).on('mousedown', '.ui-inputCheck', function() {
		var sender = $(this), input = $('input', this);

		if (sender.is('.ui-inputCheck-checked')) {
			sender.removeClass('ui-inputCheck-checked');
			input.prop('checked', false);
		}

		else {
			sender.addClass('ui-inputCheck-checked');
			input.prop('checked', true);
		}

		return false;
	});

})();