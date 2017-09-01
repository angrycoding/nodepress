(function() {

	$(document).on('mousedown', '.ui-tabBox-tab', function() {
		var sender = $(this);
		if (sender.is('.ui-tabBox-tabActive')) return;
		var tabBox = sender.closest('.ui-tabBox');

		$('.ui-tabBox-tabActive', tabBox).removeClass('ui-tabBox-tabActive');
		sender.addClass('ui-tabBox-tabActive');

		var contents = $('.ui-tabBox-contents', tabBox);

		$('.ui-tabBox-contentsActive').removeClass('ui-tabBox-contentsActive');
		$(contents[sender.index()]).addClass('ui-tabBox-contentsActive');

	});

})();