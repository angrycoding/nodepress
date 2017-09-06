var FS = require('fs');
var OS = require('os');
var TAR = require('tar');
var Async = require('async');
var Path = require('path');
var ShortId = require('shortid');
var Encryptor = require('file-encryptor');
var spawnFile = require('child_process').spawn;

var YUICompressorJar = Path.resolve(__dirname, 'java/yuicompressor-2.4.8.jar');
var JSCompressorJar = Path.resolve(__dirname, 'java/compiler.jar');
var PNGCompressorJar = Path.resolve(__dirname, 'java/pngtastic-0.5.jar');
var HTMLCompressorJar = Path.resolve(__dirname, 'java/htmlcompressor-1.5.3.jar');

function spawn(command, args, ret, cwd) {
	var options = {};
	if (cwd) options.cwd = cwd;
	var proc = spawnFile(command, args, options);
	var stdout = '', stderr = '';
	proc.on('error', function() {});
	proc.stdout.on('data', function (data) { stdout += data; });
	proc.stderr.on('data', function (data) { stderr += data; });
	proc.on('close', function(exit) {
		if (exit) exit = {code: exit, msg: stderr};
		ret(exit, stdout);
	});
}

function findFilesByMask(path, mask, retn, retf, skipPaths, limit) {

	var skipPaths = [].concat(skipPaths);
	var maxLimit = limit || Infinity;

	function findFilesByMask(path, mask, retn, retf) {

		var maskLen = -(mask.length + 1),
			maskStr = '.' + mask;

		FS.readdir(path, function(err, files) {
			var directories = [];
			Async.eachLimit(files, maxLimit, function(filePath, next) {
				if (filePath[0] === '.') return next();
				filePath = Path.resolve(path, filePath);
				if (skipPaths.indexOf(filePath) >= 0) next();
				else if (FS.lstatSync(filePath).isDirectory())
					directories.push(filePath), next();
				else if (filePath.slice(maskLen) === maskStr)
					retn(filePath, next);
				else next();
			}, function() {
				if (!directories.length) return retf();
				Async.eachLimit(directories, maxLimit, function(directory, next) {
					findFilesByMask(directory, mask, retn, next);
				}, retf);
			});
		});
	}

	Async.eachLimit(mask instanceof Array ? mask : [mask], maxLimit, function(mask, next) {
		findFilesByMask(path, mask, retn, next);
	}, retf);

}

function compressCSS(fragment, callback) {
	var tmpFileName = Path.resolve(OS.tmpdir(), ShortId.generate());
	FS.writeFile(tmpFileName, fragment, function() {
		spawn('java', [
			'-jar', YUICompressorJar,
			'--type', 'css',
			'--charset', 'UTF-8',
			'--verbose',
			tmpFileName
		], callback);
	});
}

function compressJS(fragment, callback) {
	var tmpFileName = Path.resolve(OS.tmpdir(), ShortId.generate());
	FS.writeFile(tmpFileName, fragment, function() {
		spawn('java', [
			'-jar', JSCompressorJar,
			'--compilation_level', 'SIMPLE_OPTIMIZATIONS',
			'--warning_level', 'QUIET',
			'--charset', 'UTF-8',
			'--js', tmpFileName
		], callback);
	});
}

function compressHTML(fragment, callback) {
	var tmpFileName = Path.resolve(OS.tmpdir(), ShortId.generate());
	FS.writeFile(tmpFileName, fragment, function() {
		spawn('java', [
			'-jar', HTMLCompressorJar,
			'-t', 'html',
			'--compress-js',
			'--remove-intertag-spaces',
			'--remove-surrounding-spaces', 'script,link,style,html,head,title,meta,body,!DOCTYPE,option',
			// '--remove-quotes',
			tmpFileName
		], callback);
	});
}

function compressPNG(PNGPath, callback) {
	spawn('java', [
		'-cp', PNGCompressorJar,
		'com.googlecode.pngtastic.PngtasticOptimizer',
		'--toDir', '/',
		'--compressionLevel', '9',
		PNGPath
	], callback);
}

function compressDir(src, target, key, ret) {
	var temp = Path.resolve(OS.tmpdir(), ShortId.generate());
	FS.readdir(src, function(error, files) {
		if (error) return ret(error);
		TAR.create({
			gzip: true,
			cwd: src,
			file: temp
		}, files, function(error) {
			if (error) return ret(error);
			Encryptor.encryptFile(temp, target, key, ret);
		});
	});
}

function uncompressDir(src, target, key, ret) {
	var temp = Path.resolve(OS.tmpdir(), ShortId.generate());
	Encryptor.decryptFile(src, temp, key, function(error) {
		if (error) return ret(error);
		TAR.extract({
			file: temp,
			cwd: target
		}, ret);
	});
}

module.exports = {
	findFilesByMask: findFilesByMask,
	compressCSS: compressCSS,
	compressJS: compressJS,
	compressHTML: compressHTML,
	compressPNG: compressPNG,
	compressDir: compressDir,
	uncompressDir: uncompressDir
};