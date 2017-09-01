{{var months = [
	'',
	'Января',
	'Февраля',
	'Марта',
	'Апреля',
	'Мая',
	'Июня',
	'Июля',
	'Августа',
	'Сентября',
	'Октября',
	'Ноября',
	'Декабря'
]}}

{{macro dateFormat(date)}}
	{{var date = date->split('-')}}
	{{date[2]}} {{months[date[1]->toNumber()]}} {{date[0]}}г.
{{/macro}}

{{macro dateTimeFormat(dateTime)}}
	{{var dateTime = dateTime->split(' ')}}
	{{dateFormat(dateTime[0])}}
	{{dateTime[1]}}
{{/macro}}

{{macro formatNumberText(count, endingArray)}}
	{{var newCount = count % 100}}
	{{if newCount >= 11 && newCount <= 19}}
		{{return count + ' ' + endingArray[2]}}
	{{else}}
		{{var i = newCount % 10}}
		{{if i = 1}}
			{{return count + ' ' + endingArray[0]}}
		{{elseif i = 2 || i = 3 || i = 4}}
			{{return count + ' ' + endingArray[1]}}
		{{else}}
			{{return count + ' ' + endingArray[2]}}
		{{/if}}
	{{/if}}
{{/macro}}

{{macro formatPrice(price)}}
	{{return formatNumberText(price, [
		'<span>рубль</span>',
		'<span>рубля</span>',
		'<span>рублей</span>'
	])}}
{{/macro}}

{{return [
	dateFormat: dateFormat,
	dateTimeFormat: dateTimeFormat,
	formatNumberText: formatNumberText,
	formatPrice: formatPrice,
	modal: require('modal/modal.tpl'),
	table: require('table/table.tpl'),
	button: require('button/button.tpl'),
	tabBox: require('tabBox/tabBox.tpl'),
	message: require('message/message.tpl'),
	textArea: require('textArea/textArea.tpl'),
	carousel: require('carousel/carousel.tpl'),
	inputList: require('inputList/inputList.tpl'),
	inputText: require('inputText/inputText.tpl'),
	inputCheck: require('inputCheck/inputCheck.tpl'),
	inputCount: require('inputCount/inputCount.tpl'),
	breadcrumb: require('breadcrumb/breadcrumb.tpl'),
	inputFiles: require('inputFiles/inputFiles.tpl'),
	inputRating: require('inputRating/inputRating.tpl'),
	pictureList: require('pictureList/pictureList.tpl'),
	inputRadio: require('inputRadio/inputRadio.tpl')
]}}