{{macro table(settings)}}

	{{var sort = settings.sort}}
	{{var cols = settings.cols}}
	{{var rows = settings.rows}}
	{{var class = settings.class}}

	<table class="{{['ui-table', class]}}">

		<tr>
			{{for col in cols}}
				<th width="{{col.size}}" class="{{[
					'ui-table-col',
					col.sort ? 'ui-table-col-sortable'
				]}}">
					{{col.title}}
					{{if col.sort}}
						<div class="{{[
							'ui-table-sorter',
							col.sort = sort ? 'ui-table-sorter-down'
						]}}"></div>
					{{/if}}
				</th>
			{{/for}}
		</tr>

		{{for row in rows}}
			{{if row->isArray}}
				<tr class="{{['ui-table-row', row.contents ? 'ui-table-row-title']}}">
					{{for col in cols}}
						<td width="{{col.size}}" align="{{col.align}}" {{if col.sort}}
							data-sort='{{(row[col.sort] || row[col.id])->toJSON}}'
						{{/if}}>
							{{row[col.id]}}
						</td>
					{{/for}}
				</tr>

				{{if row.contents}}

					<tr class="{{[
						'ui-table-row-contents',
						row.contentsShown ? 'ui-table-row-contents-shown'
					]}}">
						<td colspan="{{cols->length}}">
							{{row.contents}}
						</td>
					</tr>

				{{/if}}
			{{/if}}
		{{/for}}

	</table>
{{/macro}}


{{return table}}