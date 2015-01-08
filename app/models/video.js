var Q = require('Q');
	config = require('../config.json'),
	ffmpeg = require('fluent-ffmpeg');


exports.render = function(video) {
	console.log('Render Video: ',video.destination);
    var deferred = Q.defer();
	var photosStr = video.photosLocation + '/%1d.jpg';
	var startFrame = 0;

	var proc = ffmpeg(photosStr)

	.output(video.destination)
		.fps(config.video.fps)
		.videoCodec(config.video.codec)
		.size(config.video.size)
		.outputOptions('-qscale:v 6')
		.inputOptions('-start_number ' + startFrame)

	.on('end', function() {
			//console.log('Video Rendered');
			deferred.resolve();
		})
		.on('error', function(err, stdout, stderr) {
			//console.log('rendering error!',err.message);
			deferred.reject(err.message);
		})

	.run();

	return deferred.promise;
}