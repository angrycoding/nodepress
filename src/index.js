var FS = require('fs');
var URL = require('url');
var Path = require('path');
var Async = require('async');
var Express = require('express');
var Histone = require('Histone');
var BodyParser = require('body-parser');
var Session = require('express-session');
var CookieParser = require('cookie-parser');
var Router = require('./Router');
var server = Express();
var PAGES_DIR = Path.resolve(__dirname, 'pages');



if (process.env.NODE_ENV !== 'production') {
	server.use(Express.static('pages'));
	require('chokidar').watch('**/*', {
		cwd: PAGES_DIR,
		ignored: /(^|[\/\\])\../,
		ignoreInitial: true
	}).on('all', () => buildRoutes(Histone.clearCache));
}










server.use(Session({
	resave: true,
	rolling: true,
	saveUninitialized: false,
	secret: 'xxxx'
}));

server.use(BodyParser.urlencoded({
	limit: '500mb',
	extended: true
}));


server.use(CookieParser('sdafdsf'));

Histone.setCache(true);

Histone.setResourceLoader(function(uri, ret) {
	console.info('[ HISTONE ]', uri);


	// ресолвим путь и забираем из файловой системы
	var fPath = PAGES_DIR + uri;
	// console.info(fPath)
	FS.readFile(fPath, 'UTF-8', function(error, result) {
		ret(result);
	});


})

Histone.register(Histone.Global.prototype, 'resource', function(self, args, scope) {
	var result = '';
	for (var c = 0; c < args.length; c++) {
		var arg = URL.resolve(scope.baseURI, args[c]);
		result += '<link rel="stylesheet" type="text/css" href="' + arg + '" />';
	}
	return result;
});




function requestHandler(pageData, request, response, next) {

	// console.info(pageData)

	var x = {};
	for (var key in pageData.data) {
		x[key] = URL.resolve(request.url, pageData.data[key]);
	}

	if (request.session.postData) {
		response.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        x.POST = request.session.postData;
        delete request.session.postData;
    }


    x.params = pageData.params;


	// if (x.contentType) {
	// 	console.info(FS.readFileSync(x.contentType, 'UTF-8'));
	// }

	// x.params = request.params;
	// console.info(request.params)
	// response.end(JSON.stringify(x))

	Histone.require(x.template, function(result) {
		response.end(result);
	}, x);

}



function buildRoutes(ret) {

	var startPathLen = PAGES_DIR.length;

	function doBuild(path, ret, props) {

		if (!props) props = {};

		FS.readdir(path, function(error, files) {

			var dirs = [];

			Async.each(files, function(fileName, next) {

				if (fileName[0] === '.') return next();

				var filePath = Path.resolve(path, fileName);

				FS.lstat(filePath, function(error, stat) {

					if (stat.isDirectory()) {
						dirs.push(filePath);
					}

					else if (fileName[0] === '@') {
						props[Path.basename(filePath, Path.extname(filePath)).slice(1)] = filePath.slice(startPathLen);
					}


					next();
				});

			}, function(error) {


				if (Path.basename(path)[0] === '@' || path.length === startPathLen) {
					Router.add(path.slice(startPathLen).replace(/@/g, '') + '/', props);
				}

				Async.each(dirs, function(dir, next) {
					doBuild(dir, next, Object.assign({}, props));
				}, ret);

			});

		});

	}

	Router.clear();
	doBuild(PAGES_DIR, function() {
		Router.build();
		if (ret) ret();
	});

}



server.use(function(request, response, next) {

	var oldURL = request.url, newURL = URL.parse(oldURL);
	if (newURL.pathname.slice(-1) !== '/') newURL.pathname += '/';
	newURL.pathname = newURL.pathname.toLowerCase().replace(/\/\//g, '/');
	newURL = URL.format(newURL);

	if (request.method === 'POST') {

		if (newURL === URL.parse(request.headers.referer).path) {
			response.clearCookie('postUrl');
		} else {
			response.cookie('postUrl', newURL);
		}

		request.session.postData = request.body;
		response.set('X-Frame-Options', 'DENY');
		return response.status(200).end();
	}

	else if (oldURL === newURL) next();

	else response.redirect(302, newURL);

});

server.use(function(request, response, next) {
	var route = Router.match(request.path);
	if (route) requestHandler(route, request, response, next);
	else next();
});

server.use(function(request, response) {
	response.redirect(302, '/error/');
});


buildRoutes(() => server.listen(9999));