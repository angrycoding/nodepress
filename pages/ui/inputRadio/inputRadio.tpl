{{macro inputRadio(settings)}}

	{{resource('inputRadio.css')}}

	{{var class = settings.class}}
	{{var label = settings.label}}
	{{var name = settings.name}}
	{{var value = settings.value}}
	{{var checked = settings.checked}}

	<div class="{{['ui-inputRadio', class]}}">
		<input type="radio" name="{{name}}" value="{{value}}" {{if checked}}checked="checked"{{/if}} />
		<div>{{label}}</div>
	</div>

{{/macro}}

{{return inputRadio}}