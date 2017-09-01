var Path = require('path');
var FS = require('fs-extra');
var Async = require('async');
var Histone = require('histone');
var Utils = require('./build/Utils');
var SRC_PATH = Path.resolve(__dirname, 'src');
var DIST_PATH = Path.resolve(__dirname, 'dist');

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
			Utils.compressCSS(data, function(error, data) {
				FS.writeFile(CSSPath, data, next);
			});
		});
	}, callback);
}

function compressPNG(callback) {
	Utils.findFilesByMask(DIST_PATH, 'png', function(PNGPath, next) {
		console.info('[ COMPRESSING PNG ]', PNGPath);
		Utils.compressPNG(PNGPath, function(error, data) {
			console.info('[ COMPRESSING PNG ]', data.split('\n').shift());
			next();
		});
	}, callback);
}

function compressJS(callback) {
	Utils.findFilesByMask(DIST_PATH, 'js', function(JSPath, next) {
		console.info('[ COMPRESSING JS ]', JSPath);
		FS.readFile(JSPath, 'UTF-8', function(error, data) {
			Utils.compressJS(data, function(error, data) {
				FS.writeFile(JSPath, data, next);
			});
		});
	}, callback, [], 1);
}

function compressTPL(callback) {
	Utils.findFilesByMask(DIST_PATH, 'tpl', function(tplPath, next) {
		console.info('[ COMPRESSING TPL ]', tplPath);
		FS.readFile(tplPath, 'UTF-8', function(error, data) {
			Utils.compressHTML(data, function(error, data) {
				data = Histone(data).getAST();
				data = JSON.stringify(data);
				FS.writeFile(tplPath, data, next);
			});
		});
	}, callback);
}

prepareDist(function() {
	Async.each([compressCSS, compressPNG, compressTPL, compressJS], function(task, nextTask) {
		task(nextTask);
	}, function() {
		console.info('done');
	});
});