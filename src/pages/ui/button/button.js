(function() {

	var documentRef = $(document);

	documentRef.on('ui-disable', '.ui-button', function() {
		$(this).addClass('ui-disabled');
	});

	documentRef.on('ui-enable', '.ui-button', function() {
		$(this).removeClass('ui-disabled');
	});

	documentRef.on('mousedown', '.ui-button', function(event) {
		event.stopPropagation();
	});

	documentRef.on('click', '.ui-button', function(event) {
		var sender = $(this);
		if (sender.is('.ui-disabled')) return false;
		var type = $('input', sender).attr('type');
		if (type === 'submit') sender.closest('form').submit();
		else if (type === 'reset') sender.closest('form').reset();
	});

})();