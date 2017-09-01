{{macro inputList(settings)}}

	{{resource('inputList.css')}}

	{{var name = settings.name}}
	{{var label = settings.label}}
	{{var value = settings.value}}
	{{var class = settings.class}}
	{{var items = settings.items}}
	{{var error = settings.error}}
	{{var required = settings.required}}
	{{var disabled = settings.disabled}}
	{{var placeHolder = settings.placeHolder}}

	{{var activeItem}}
		{{for item in items}}
			{{if item.value = value}}
				{{return item}}
			{{/if}}
		{{/for}}
		{{return null}}
	{{/var}}

	<div class="{{[
		'ui-inputList',
		required ? 'ui-inputList-required',
		disabled ? 'ui-inputList-disabled',
		error ? 'ui-inputList-error',
		!activeItem ? 'ui-inputList-empty',
		class
	]}}">
		{{if label}}<div class="ui-inputList-label" unselectable="on">{{label}}:</div>{{/if}}
		<div class="ui-inputList-wrapper">
			<div class="ui-inputList-star"></div>
			<div class="ui-inputList-errorBorder"></div>
			<div class="ui-inputList-inputBorder">

				<div class="ui-inputList-item" unselectable="on">
					{{if activeItem}}
						{{activeItem.title}}
					{{elseif placeHolder}}
						{{placeHolder}}
					{{else}}
						&nbsp;
					{{/if}}
				</div>
				<div class="ui-inputList-arrow"></div>
				<select name="{{name}}" value="{{activeItem.value}}">
					{{if !activeItem}}<option
						class="ui-inputList-default"
						disabled="disabled"
						selected="selected">
						{{placeHolder}}
					</option>{{/if}}
					{{for item in items}}
						<option value="{{item.value}}" {{if item.value = activeItem.value}}selected="selected"{{/if}}>
							{{item.title}}
						</option>
					{{/for}}
				</select>

			</div>
		</div>
	</div>

{{/macro}}

{{return inputList}}