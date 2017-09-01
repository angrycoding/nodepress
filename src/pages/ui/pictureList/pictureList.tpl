{{macro pictureList(pictures)}}

	{{var picture = pictures[0]}}

	<div class="ui-pictureList">

		<li class="ui-pictureList-main">
			<img src="{{picture.src}}"
				alt="{{picture.alt}}"
				title="{{picture.title}}"
				width="391"
			/>
		{{if pictures->length > 1}}
			<li class="ui-pictureList-preview">
				{{for picture in pictures}}
					<div style="box-shadow: 0px 0px 1px gray; width: 90px; height: 90px; margin-bottom: 10px; cursor: pointer;">
						<img src="{{picture.src}}"
							alt="{{picture.alt}}"
							title="{{picture.title}}"
							width="100%"
							height="100%"
						/>
					</div>
				{{/for}}
		{{/if}}

	</div>
{{/macro}}

{{return pictureList}}