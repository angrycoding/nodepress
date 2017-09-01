{{macro inputCheck(settings)}}

	{{var label = settings.label}}
	{{var name = settings.name}}
	{{var checked = settings.checked}}
	{{var form = settings.form}}
	{{var value = settings.value}}

	<div class="{{['ui-inputCheck', checked ? 'ui-inputCheck-checked']}}">
		<input type="checkbox"
			{{if form}}form="{{form}}"{{/if}}
			name="{{name}}" value="{{value}}" {{if checked}}checked="checked"{{/if}} />
		{{label}}
	</div>

{{/macro}}

{{return inputCheck}}