var Q = require('Q'),
    config = require('../config.json'),
    ffmpeg = require('fluent-ffmpeg');


exports.render = function(video) {
    var deferred = Q.defer();
    var photosStr = video.photosLocation + '/%1d.jpg';
    var startFrame = video.step > config.gif.maxFrames ? video.step - config.gif.maxFrames - 1 : 0;

    //console.log('Render GIF: %s, from %s to %s', video.destination, startFrame, video.step);
    //console.log('step: ' + video.step);

    var proc = ffmpeg(photosStr)
        .inputOptions('-start_number ' + startFrame)
        .output(video.destination)
        .fps(config.gif.fps)
        .size(config.gif.size)

    .on('end', function() {
            deferred.resolve();
        })
        .on('error', function(err, stdout, stderr) {
            deferred.reject(err.message);
        })

    .run();

    return deferred.promise;
};