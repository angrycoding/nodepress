var OS = require('os');
var TAR = require('tar');
var Path = require('path');
var FS = require('fs-extra');
var Multer = require('multer');
var ShortId = require('shortid');
var Express = require('express');
var Encryptor = require('file-encryptor');


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

var server = Express();

server.use(Multer({

	dest: OS.tmpdir(),

	onFileUploadStart: function(file, request, response) {
		console.info(file);
		return true;
		// if (isReleasing || file.extension !== 'gz') return false;
		// return (isReleasing = true);
	},

	rename: function() {
		return ShortId.generate();
	},

	onFileUploadComplete: function(source, request, response) {
		console.info('uploaded', source);

		var releaseDir = Path.resolve(__dirname, 'x');
		FS.mkdirs(releaseDir, function(error) {
			uncompressDir(source.path, releaseDir, 'PASSWORD', function() {
				console.info('done')
			})
		});

		// console.info('uploaded', source.path);
		// prepareRelease(source = source.path, function(error, target) {
		// 	console.info('prepared', target);
		// 	FS.remove(source, function() {
		// 		if (!error) applyRelease(target, function() {
		// 			console.info('applied');
		// 			isReleasing = false;
		// 		}); else isReleasing = false;
		// 	});
		// });
	}

}));

server.listen(10000);