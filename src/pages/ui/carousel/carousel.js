(function() {

	var autoScrollTimer;
	var autoScrollInterval = 4000;

	function nextOrFirst(el) {
		var next = el.next();
		if (next.length) return next;
		return $(':first-child', el.parent());
	}

	function prevOrLast(el) {
		var prev = el.prev();
		if (prev.length) return prev;
		return $(':last-child', el.parent());
	}


	function scroll(carousel, offset) {

		var layers = $('.ui-carousel-layers', carousel);
		var children = layers.children();

		if (offset > 0) {

			layers.animate({
				scrollLeft: layers.outerWidth() * offset
			}, 500, function() {
				$(children.slice(0, offset)).
				insertAfter(children.last());
				layers.scrollLeft(0);
			});

		}

		else if (offset < 0) {

			$(children.slice(offset)).
			insertBefore(children.first());

			layers.scrollLeft(layers.outerWidth() * -offset);

			layers.animate({
				scrollLeft: 0
			}, 500, function() {
			});


		}

	}

	function startTimer() {
		autoScrollTimer = setInterval(function() {
			$('.ui-carousel .ui-carousel-buttonNext').each(function() {
				$(this).trigger('mousedown');
			});
		}, autoScrollInterval);
	}

	$(document).on('mousedown touchstart', '.ui-carousel-buttonNext', function() {

		var carousel = $(this).closest('.ui-carousel');
		var activeDot = $('.ui-carousel-dot-active', carousel);
		activeDot.removeClass('ui-carousel-dot-active');
		nextOrFirst(activeDot).addClass('ui-carousel-dot-active');
		scroll(carousel, 1);

		return false;

	});

	$(document).on('mousedown touchstart', '.ui-carousel-buttonPrev', function() {

		var carousel = $(this).closest('.ui-carousel');
		var activeDot = $('.ui-carousel-dot-active', carousel);
		activeDot.removeClass('ui-carousel-dot-active');
		prevOrLast(activeDot).addClass('ui-carousel-dot-active');
		scroll(carousel, -1);

		return false;

	});

	$(document).on('mousedown touchstart', '.ui-carousel-dot', function() {

		var newActiveDot = $(this);

		var carousel = newActiveDot.closest('.ui-carousel');
		var oldActiveDot = $('.ui-carousel-dot-active', carousel);
		oldActiveDot.removeClass('ui-carousel-dot-active');
		newActiveDot.addClass('ui-carousel-dot-active');

		scroll(carousel, newActiveDot.index() - oldActiveDot.index());

		return false;
	});

	$(document).on('mouseenter', '.ui-carousel', function() {
		clearInterval(autoScrollTimer);
	});

	$(document).on('mouseleave', '.ui-carousel', function() {
		startTimer();
	});


	if ($('.ui-carousel').length) startTimer();

})();