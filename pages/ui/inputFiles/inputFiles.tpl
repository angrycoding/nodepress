{{macro inputFiles(settings)}}

	{{var name = settings.name}}
	{{var label = settings.label}}
	{{var files = settings.files}}

	<div class="ui-inputFiles" data-name="{{name}}">

		{{if label}}<div class="ui-inputFiles-label">{{label}}:</div>{{/if}}

		<div class="ui-inputFiles-frame">

			<div class="ui-inputFiles-images">

				{{for image in files}}
					<li class="ui-inputFiles-image">
						<div class="left">◀</div>
						<div class="right">▶</div>
						<div class="remove">✖</div>
						<img src="{{image}}" />
						<textarea name="{{name}}[]">{{image}}</textarea>
				{{/for}}

			</div>

			<input type="file" />
		</div>
	</div>

{{/macro}}

{{return inputFiles}}