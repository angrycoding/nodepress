{{macro breadcrumb(items)}}
	{{resource('breadcrumb.css')}}
	{{var length = items->length}}
	<div class="ui-breadcrumb">
		{{for title in items}}
			{{if self.index != self.last}}
				<a href="{{range(length - self.index - 1)->map('..')->join('/')}}">{{title}}</a> >
			{{else}}
				{{title}}
			{{/if}}
		{{/for}}
	</div>
{{/macro}}

{{return breadcrumb}}