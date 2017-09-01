{{macro inputRating(settings)}}

	{{resource('inputRating.css')}}

	{{var name = settings.name}}
	{{var disabled = settings.disabled}}
	{{var max = settings.max->toNumber(5)}}
	{{var value = settings.value->toNumber(0)}}

	<div class="{{['ui-inputRating', disabled ? 'ui-inputRating-disabled']}}">
		<input type="hidden" name="{{name}}" value="{{value}}" {{if disabled}}disabled="true"{{/if}} />
		{{for star in range(1, max)}}<li class="{{['ui-inputRating-star', star <= value ? 'ui-inputRating-starChecked']}}">{{/for}}
	</div>

{{/macro}}

{{return inputRating}}