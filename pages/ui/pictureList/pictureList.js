(function() {

	var documentRef = $(document);

	documentRef.on('mousedown touchstart', '.ui-pictureList-preview img', function() {

		var sender = $(this);
		var pictureList = sender.closest('.ui-pictureList');
		var pictureMain = $('.ui-pictureList-main img', pictureList);

		pictureMain.attr({
			src: sender.attr('src'),
			alt: sender.attr('alt'),
			title: sender.attr('title')
		});

		return false;

	});

})();