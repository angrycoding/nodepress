{{macro modal(settings)}}

	{{var class = settings.class}}
	{{var effect = settings.effect}}
	{{var visible = settings.visible}}
	{{var contents = settings.contents}}

	<div class="{{[
		'ui-modal',
		visible ? 'ui-modal-visible',
		effect ? 'ui-modal-effect',
		class
	]}}">
		<div class="ui-modal-overlay"></div>
		<div class="ui-modal-wrapper">
			<div class="ui-modal-contents">
				{{contents}}
			</div>
		</div>
	</div>
{{/macro}}

{{return modal}}