<!DOCTYPE html>
<html lang="ru" class="can-hover">
	<head>
		<title>{{require(this.title, this)}}</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta name="description" content="{{loadText(this.description)}}" />
		<meta name="keywords" content="{{loadText(this.keywords)}}" />
		<link rel="stylesheet" type="text/css" href="/style/style.css" />
		<link rel="shortcut icon" type="image/png" href="/media/logo.png"/>


		<script type="text/javascript" src="/script/jquery.js"></script>
		<script type="text/javascript" src="/script/jquery.cookie.js"></script>
		<script type="text/javascript">

			function formIframeOnLoad(iframe) {
				try { iframe.contentDocument; }
				catch (e) {
					iframe.src = 'about:blank';
					var postUrl = $.cookie('postUrl');
					if (postUrl) {
						window.location.href = postUrl;
					} else {
						window.location.reload(true);
					}
				}
			}

		</script>
	</head>
	<body>
		{{var ui = require('/ui/ui.tpl')}}

		<input type="button" onclick="window.location.reload(true);" />
		<div style="border: 1px solid red; padding: 20px; margin: 1px;">header</div>
		<div style="flex: 1; display: flex;">

			<div style="flex: 1; border: 1px solid red; margin: 1px; padding: 10px;">

				{{ui.breadcrumb(require(this.breadcrumb, this))}}


				{{for key:value in this}}
					<div style="border: 1px solid red; margin: 2px;">
						{{key}} = {{value->toJSON}}
						 = {{*key != 'template' ? require(value)*}}
					</div>
				{{/for}}

				<iframe src="about:blank" style="display: none;" name="form-iframe" onload="formIframeOnLoad(this);"></iframe>

				<form method="POST" target="form-iframe" _action="/catalog">
					<input type="hidden" name="action" value="post" />

					{{ui.inputText([
						label: 'Введите имя',
						name: 'name'
					])}}

					{{ui.textArea([
						label: 'Введите сообщение',
						name: 'message'
					])}}

					{{ui.button([
						value: 'xxx',
						type: 'submit'
					])}}


					{{ui.message([
						message: 'Тестовое сообщение',
						success: true
					])}}

					<div>
						{{ui.inputRating([
							max: 10,
							value: 4
						])}}
					</div>

					<div>
						{{ui.inputRadio([
							label: 'x',
							checked: true
						])}}
						{{ui.inputRadio([
							label: 'y',
							checked: false
						])}}
					</div>

					<div>
						{{ui.inputList([
							label: 'Список',
							items: [
								[title: 'sadfiasbdfisadobfdasoib'],
								[title: 'sadfiasbdfisadobfdasoib'],
								[title: 'sadfiasbdfisadobfdasoib']
							]
						])}}
					</div>

					<input type="submit" />
					<input type="submit" value="catalog" formaction="catalog" />
				</form>

				{{require(this.left, this)}}

			</div>

			<div style="width: 30%; border: 1px solid red; margin: 1px;">
				RIGHT_COLUMN
			</div>


		</div>
		<div style="border: 1px solid red; padding: 20px; margin: 1px;">footer</div>
	</body>
</html>