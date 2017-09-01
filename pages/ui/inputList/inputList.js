(function() {

	$(document).on('mousedown', '.ui-inputList-disabled', false);

	$(document).on('change', '.ui-inputList select', function() {
		var sender = $(this), inputList = sender.closest('.ui-inputList');
		inputList.removeClass('ui-inputList-empty');
		$('.ui-inputList-default', inputList).remove();
		$('.ui-inputList-item', inputList).text($('option:selected', sender).text());
	})

})();