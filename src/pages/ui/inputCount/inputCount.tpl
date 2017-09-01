{{macro inputCount(settings)}}

	{{var min = settings.min}}
	{{var max = settings.max}}
	{{var data = settings.data}}
	{{var name = settings.name}}
	{{var form = settings.form}}
	{{var value = settings.value}}
	{{var class = settings.class}}
	{{var repeat = settings.repeat}}
	{{var disabled = settings.disabled}}

	<div class="{{[
		'ui',
		'ui-inputCount ui-inputCount-dec',
		repeat ? 'ui-inputCount-repeat',
		min->isNumber && min = value ? 'ui-inputCount-decDisabled',
		max->isNumber && max = value ? 'ui-inputCount-incDisabled',
		disabled ? 'ui-disabled',
		class
	]}}"
		data-data='{{data->toJSON}}'>
		<div class="ui-inputCount-inc">
			<input
				type="text"
				name="{{name}}"
				value="{{value}}"
				readonly="readonly"
				{{if form}}form="{{form}}"{{/if}}
				{{if disabled}}disabled="disabled"{{/if}}
				class="ui-inputCount-value"
				data-min='{{min}}'
				data-max='{{max}}'
			/>
		</div>
	</div>
{{/macro}}

{{return inputCount}}