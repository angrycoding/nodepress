(function() {

	var documentElement = $(document.documentElement);

	documentElement.on('ui:modal:open', '.ui-modal', function() {
		documentElement.addClass('ui-modal-noscroll');
		$(this).addClass('ui-modal-visible');
	});

	documentElement.on('click', '.ui-modal-close', function() {
		$(this).closest('.ui-modal').removeClass('ui-modal-visible');
		documentElement.removeClass('ui-modal-noscroll');
	});

	documentElement.ready(function() {
		var modal = $('.ui-modal-visible');
		if (modal.length) {
			documentElement.addClass('ui-modal-noscroll');
			if (modal.is('.ui-modal-effect')) {
				modal = $('.ui-modal-contents', modal);

				for( var l = 40, i = 0; i < 10; i++ ) {
					modal.animate({
						'margin-left': "+=" + ( l = -l ) + 'px'
					}, 50);
				}

			}
		}
	});

})();