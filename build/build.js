var Path = require('path');
var FS = require('fs-extra');
var Async = require('async');
var Unirest = require('unirest');
var Histone = require('histone');
var Utils = require('./Utils');
var SRC_PATH = Path.resolve(__dirname, '../src');
var DIST_PATH = Path.resolve(__dirname, '../dist');
var TGZ_PATH = Path.resolve(__dirname, '../dist.tgz');

function prepareDist(ret) {
	console.info('[ PREPARE ]', 'removing', DIST_PATH);
	FS.remove(DIST_PATH, function(error) {
		if (error) return ret(error);
		var modulesDir = Path.resolve(SRC_PATH, 'node_modules');
		FS.copy(SRC_PATH, DIST_PATH, function(path) {
			var name = Path.basename(path);
			if (name[0] === '.') return false;
			if (path === modulesDir) return false;
			console.info('[ PREPARE ]', 'copying', path);
			return true;
		}, ret);
	});
}

function compressCSS(callback) {
	Utils.findFilesByMask(DIST_PATH, 'css', function(CSSPath, next) {
		console.info('[ COMPRESSING CSS ]', CSSPath);
		FS.readFile(CSSPath, 'UTF-8', function(error, data) {
			if (error) callback(error);
			else Utils.compressCSS(data, function(error, data) {
				if (error) callback(error);
				else FS.writeFile(CSSPath, data, function(error) {
					if (error) callback(error);
					else next();
				});
			});
		});
	}, callback);
}

function compressPNG(callback) {
	Utils.findFilesByMask(DIST_PATH, 'png', function(PNGPath, next) {
		console.info('[ COMPRESSING PNG ]', PNGPath);
		Utils.compressPNG(PNGPath, function(error, data) {
			console.info('[ COMPRESSING PNG ]', data.split('\n').shift());
			if (error) callback(error);
			else next();
		});
	}, callback);
}

function compressJS(callback) {
	Utils.findFilesByMask(DIST_PATH, 'js', function(JSPath, next) {
		console.info('[ COMPRESSING JS ]', JSPath);
		FS.readFile(JSPath, 'UTF-8', function(error, data) {
			if (error) callback(error);
			else Utils.compressJS(data, function(error, data) {
				if (error) callback(error);
				else FS.writeFile(JSPath, data, function(error) {
					if (error) callback(error);
					else next();
				});
			});
		});
	}, callback, [], 1);
}

function compressTPL(callback) {
	Utils.findFilesByMask(DIST_PATH, 'tpl', function(tplPath, next) {
		console.info('[ COMPRESSING TPL ]', tplPath);
		FS.readFile(tplPath, 'UTF-8', function(error, data) {
			if (error) callback(error);
			else Utils.compressHTML(data, function(error, data) {
				if (error) callback(error);
				else {
					data = Histone(data).getAST();
					data = JSON.stringify(data);
					FS.writeFile(tplPath, data, function(error) {
						if (error) callback(error);
						else next();
					});
				}
			});
		});
	}, callback);
}




Unirest.post('http://localhost:10000')
// // unirest.post('http://127.0.0.1:9999')
.attach('file', TGZ_PATH)
.end(function (response) {
    console.log(response.body);
});

return

prepareDist(function() {
	Async.each([compressCSS, compressPNG, compressTPL, compressJS], function(task, nextTask) {
		task(nextTask);
	}, function(error) {

		console.info('done', error);

		Utils.compressDir(DIST_PATH, TGZ_PATH, 'PASSWORD', function(error) {
			console.info('done', error);
		});


	});
});