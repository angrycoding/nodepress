{{macro tabBox(settings)}}

	{{var tabs = settings.tabs}}
	{{var active = settings.active}}

	<div class="ui-tabBox">

		<div class="ui-tabBox-tabs">
			{{for tab in tabs}}
				<li class="{{['ui-tabBox-tab', self.index = active ? 'ui-tabBox-tabActive']}}" unselectable="on">
					{{tab.label}}
			{{/for}}
		</div>

		{{for tab in tabs}}
			<div class="{{['ui-tabBox-contents', self.index = active ? 'ui-tabBox-contentsActive']}}">
				{{tab.contents}}
			</div>
		{{/for}}

	</div>

{{/macro}}

{{return tabBox}}