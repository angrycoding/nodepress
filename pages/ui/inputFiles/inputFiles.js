(function() {

	$(document).on('click', '.ui-inputFiles-image .remove', function(event) {
		$(this).closest('.ui-inputFiles-image').remove();
	});

	$(document).on('click', '.ui-inputFiles-image .left', function(event) {
		var wrapper = $(this).closest('.ui-inputFiles-image');
		wrapper.insertBefore(wrapper.prev());
	});

	$(document).on('click', '.ui-inputFiles-image .right', function(event) {
		var wrapper = $(this).closest('.ui-inputFiles-image');
		wrapper.insertAfter(wrapper.next());
	});

	$(document).on('change', '.ui-inputFiles input', function(event) {

		var widget = $(this).closest('.ui-inputFiles');
		var name = widget.data('name');
		var images = $('.ui-inputFiles-images', widget);


	  $.each(event.target.files, function(index, file) {
	    var reader = new FileReader();
	    reader.onload = function(event) {

	    	var wrapper = $('<div />');
	    	wrapper.addClass('ui-inputFiles-image');

	    	wrapper.append('<div class="left">◀</div>');
	    	wrapper.append('<div class="right">▶</div>');
	    	wrapper.append('<div class="remove">✖</div>');

	    	var field = $('<textarea />');
	    	field.css({display: 'none'});
	    	field.attr('name', name + '[]');
	    	field.val(event.target.result);
	    	wrapper.append(field);

	    	var img = $('<img />');
	    	img.attr('src', event.target.result);
	    	wrapper.append(img);

	    	images.append(wrapper);



	    };
	    reader.readAsDataURL(file);
	  });
	});

})();