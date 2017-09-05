var FS = require('fs');
var URL = require('url');
var Path = require('path');
var Async = require('async');
var Express = require('express');
var Histone = require('Histone');
var BodyParser = require('body-parser');
var Session = require('express-session');
var CookieParser = require('cookie-parser');
var server = Express();
var pagesDir = Path.resolve(__dirname, 'pages');


var Router = require('./Router');







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

Histone.setCache(false);

Histone.setResourceLoader(function(uri, ret) {
	console.info('[ HISTONE ]', uri);


	// ресолвим путь и забираем из файловой системы
	var fPath = pagesDir + uri;
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




function handler(pageData, request, response, next) {

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


function buildProps(path, retf) {

	var startPathLen = path.length;

	var filePathToURL = function(path) {
		return path.slice(startPathLen);
	};

	var dirPathToRoute = function(path) {
		var result = filePathToURL(path);
		result = result.replace(/@/g, '');
		return result;
	};

	function buildProps(path, ret, props) {

		if (!props) props = {};

		FS.readdir(path, function(error, files) {

			var dirs = [];

			Async.each(files, function(fileName, next) {

				if (fileName[0] === '.') return next();

				var filePath = Path.resolve(path, fileName);

				FS.lstat(filePath, function(error, stat) {

					if (!stat.isDirectory()) {
						if (fileName[0] === '@') {
							props[Path.basename(filePath, Path.extname(filePath)).slice(1)] = filePathToURL(filePath);
						}
					}


					else dirs.push(filePath);


					next();
				});

			}, function(error) {

				var xProps = {};
				for (var key in props) xProps[key] = props[key];

				if (Path.basename(path)[0] === '@' || path.length === startPathLen) {
					Router.add(dirPathToRoute(path) + '/', Object.assign({}, props));
				}

				Async.each(dirs, function(dir, next) {
					buildProps(dir, next, Object.assign({}, props));
				}, ret);

			});

		});

	}


	buildProps(path, retf);

}


server.use(Express.static('pages'))


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


buildProps(pagesDir, function() {

	Router.build();

	server.use(function(request, response, next) {
		// console.info(request.path)
		var route = Router.match(request.path);
		// console.info(route)
		if (route) {
			// response.end(JSON.stringify(route));
			// return;
			handler(route, request, response, next);
		}
		else next();
	});

	server.use(function(request, response) {
		response.redirect(302, '/error/');
	});

	server.listen(9999);

});