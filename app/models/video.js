var Q = require('Q'),
	config = require('../config.json'),
	ffmpeg = require('fluent-ffmpeg');


exports.render = function(video) {
	var deferred = Q.defer();
	var photosStr = video.photosLocation + '/%1d.jpg';
	var startFrame = video.step > config.video.maxFrames ? video.step - config.video.maxFrames : 0;

	console.log('Render Video: %s, from %s to %s', video.destination,startFrame,video.step);

	var proc = ffmpeg(photosStr)
		.inputOptions('-start_number ' + startFrame)
		.output(video.destination)
		.fps(config.video.fps)
		.videoCodec(config.video.codec)
		.size(config.video.size)
		.outputOptions('-qscale:v 6')
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
};