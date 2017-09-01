(function() {

	var documentRef = $(document);

	documentRef.on('mousedown', '.ui-inputRating-star', function() {

		var sender = $(this), rating = sender.closest('.ui-inputRating');
		if (rating.is('.ui-inputRating-disabled')) return;

		if (!sender.is('.ui-inputRating-starChecked')) {
			$('input', rating).val(sender.index());
			sender.nextAll('li').removeClass('ui-inputRating-starChecked');
			sender.prevAll('li').add(sender).addClass('ui-inputRating-starChecked');
		}

		else if (sender.nextAll('.ui-inputRating-starChecked').length) {
			$('input', rating).val(sender.index());
			sender.nextAll('li').removeClass('ui-inputRating-starChecked');
		}

		else {
			$('input', rating).val(sender.index() - 1);
			sender.removeClass('ui-inputRating-starChecked');
		}

		return false;

	});

})();