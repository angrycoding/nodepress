{{macro textArea(settings)}}

	{{resource('textArea.css')}}

	{{var name = settings.name}}
	{{var label = settings.label}}
	{{var class = settings.class}}
	{{var error = settings.error}}
	{{var height = settings.height}}
	{{var value = settings.value->toString}}
	{{var placeHolder = settings.placeHolder}}
	{{var max = settings.max->toNumber->toRound}}
	{{var max = max->isNumber ? (max <= 0 ? null : max) : null}}
	{{var resize = settings.resize->isUndefined ? true : settings.resize}}

	<div class="{{['ui-textArea', class, !resize ? 'ui-textArea-fixed', error ? 'ui-textArea-error']}}" data-max='{{max}}'>
		{{if label}}<div class="ui-textArea-label" unselectable="on">{{label}}:</div>{{/if}}
		<div class="ui-textArea-border">
			<div class="ui-textArea-errorBorder"></div>
			<textarea name="{{name}}" placeholder="{{placeHolder}}" rows="{{height}}">{{value}}</textarea>
			{{if max->isNumber}}
				{{var charsLeft = max - value->length}}
				<div class="{{['ui-textArea-counter', charsLeft <= 10 ? 'ui-textArea-overflow']}}">
					осталось символов
					<span>{{charsLeft}}</span>
				</div>
			{{/if}}
		</div>
	</div>
{{/macro}}

{{return textArea}}