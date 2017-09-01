(function() {

	var documentRef = $(document);

	documentRef.on('change keydown keyup cut paste', '.ui-textArea textarea', function(event) {

		var sender = $(this),
			textArea = sender.closest('.ui-textArea'),
			counter = $('.ui-textArea-counter', textArea),
			max = textArea.data('max');

		if (typeof max === 'number') {
			var left = max - sender.val().length;
			$('span', counter).text(left);
			if (left <= 10) counter.addClass('ui-textArea-overflow');
			else counter.removeClass('ui-textArea-overflow');
		}

	});

	documentRef.ready(function() {
		$('.ui-textArea textarea').trigger('change');
	})

})();