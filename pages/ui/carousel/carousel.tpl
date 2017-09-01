{{macro carousel(settings)}}

	{{var alt = settings.alt}}
	{{var class = settings.class}}
	{{var items = settings.items}}

	<div class="{{['ui-carousel', class]}}">

		<div class="ui-carousel-layers">
			{{for item in items}}
				{{var item = item->isString ? [img: item] : item}}
				<li class="ui-carousel-layer">
					<img src="{{item.img}}" alt="{{alt}}" />
			{{/for}}
		</div>

		<div class="ui-carousel-frame"></div>
		<div class="ui-carousel-button ui-carousel-buttonPrev"></div>
		<div class="ui-carousel-button ui-carousel-buttonNext"></div>

		<div class="ui-carousel-dots">
			{{for in items}}
				<li class="{{['ui-carousel-dot', !self.index ? 'ui-carousel-dot-active']}}">
			{{/for}}
		</div>

	</div>

{{/macro}}

{{return carousel}}