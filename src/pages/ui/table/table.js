(function() {

	$(document).on('mousedown', '.ui-table-row-title', function() {
		var sender = $(this),
			contents = sender.next('.ui-table-row-contents');
		if (contents.is('.ui-table-row-contents-shown'))
			contents.removeClass('ui-table-row-contents-shown');
		else contents.addClass('ui-table-row-contents-shown');
		sender.prevAll('.ui-table-row-contents-shown').
		removeClass('ui-table-row-contents-shown');
		contents.nextAll('.ui-table-row-contents-shown').
		removeClass('ui-table-row-contents-shown');
	});

	$(document).on('click', '.ui-table-sorter', function() {

		var colIndex = $(this).closest('th').index();
		var rows = $(this).closest('tr');
		var isDown = $(this).is('.ui-table-sorter-down');

		$('.ui-table-sorter', rows).removeClass('ui-table-sorter-up');
		$('.ui-table-sorter', rows).removeClass('ui-table-sorter-down');

		rows = rows.nextAll('.ui-table-row');

		rows.sort(function(a, b) {

			a = $('td', a).eq(colIndex).data('sort');
			b = $('td', b).eq(colIndex).data('sort');
			if (!isDown) b = [a, a = b][0];

			if (typeof a === 'number' && typeof b === 'number')
				return a - b;

			return ((a + '').localeCompare(b + ''));
		});

		var table = $(this).closest('.ui-table');

		$.each(rows, function (index, row) {
			table.append(row, $(row).next('.ui-table-row-contents'));
		});

		if (isDown) {
			$(this).removeClass('ui-table-sorter-down');
			$(this).addClass('ui-table-sorter-up');
		} else {
			$(this).removeClass('ui-table-sorter-up');
			$(this).addClass('ui-table-sorter-down');
		}


	});


})();