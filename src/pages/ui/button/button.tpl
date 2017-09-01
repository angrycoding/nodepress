{{macro button(settings)}}

	{{resource('button.css')}}

	{{var value = settings.value}}
	{{var class = settings.class}}
	{{var type = settings.type}}
	{{var href = settings.href}}
	{{var size = settings.size}}
	{{var disabled = settings.disabled}}
	{{var tagName = type = 'link' ? 'a' : 'div'}}

	<{{tagName}} {{if type = 'link'}}href="{{href}}"{{/if}} class="{{[
		'ui',
		'ui-button',
		disabled ? 'ui-disabled',
		size ? 'ui-button-size-' + size,
		class
	]}}" unselectable="on">
		<div class="ui-button-right">
			<div class="ui-button-middle">
				{{value}}
			</div>
		</div>
		{{if type = 'submit' || type = 'reset'}}
			<input type="{{type}}" {{if disabled}}disabled="disabled"{{/if}} />
		{{/if}}
	</{{tagName}}>

{{/macro}}

{{return button}}