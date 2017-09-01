{{var types = [EMAIL: 1, PASSWORD: 2]}}

{{macro inputText(settings)}}

	{{resource('inputText.css')}}

	{{var type = settings.type}}
	{{var name = settings.name}}
	{{var form = settings.form}}
	{{var label = settings.label}}
	{{var value = settings.value}}
	{{var class = settings.class}}
	{{var error = settings.error}}
	{{var required = settings.required}}
	{{var disabled = settings.disabled}}
	{{var readOnly = settings.readOnly}}
	{{var autoFocus = settings.autoFocus}}
	{{var placeHolder = settings.placeHolder}}

	{{var type = (
		type = 'password' ? type :
		type = 'number' ? type :
		'text'
	)}}


	<div class="{{[
		'ui-inputText',
		'ui-inputText-' + type,
		required ? 'ui-inputText-required',
		disabled ? 'ui-inputText-disabled',
		error ? 'ui-inputText-error',
		class
	]}}">
		{{if label}}<div class="ui-inputText-label" unselectable="on">{{label}}:</div>{{/if}}
		<div class="ui-inputText-wrapper">

			<div class="ui-inputText-star"></div>
			<div class="ui-inputText-errorBorder"></div>

			<div class="ui-inputText-inputBorder">
				<input type="{{type}}"
					name="{{name}}"
					value="{{value}}"
					{{if form}}form="{{form}}"{{/if}}
					{{if disabled}}disabled="disabled"{{/if}}
					{{if readOnly}}readonly="readonly"{{/if}}
					{{if autoFocus}}autofocus="autofocus"{{/if}}
					placeholder="{{placeHolder}}" />
			</div>
		</div>
	</div>

{{/macro}}

{{return inputText->extend(types)}}