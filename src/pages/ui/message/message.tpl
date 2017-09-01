{{macro message(settings)}}

	{{resource('message.css')}}

	{{var class = settings.class}}
	{{var message = settings.message}}
	{{var success = settings.success}}

	<div class="{{['ui-message', success ? 'ui-message-success', class]}}">
		{{message}}
	</div>

{{/macro}}

{{return message}}