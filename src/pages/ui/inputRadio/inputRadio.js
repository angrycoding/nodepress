(function() {

	$(document).on('mousedown', '.ui-inputRadio', function() {
		$('input', this).prop('checked', true);
		return false;
	});

})();