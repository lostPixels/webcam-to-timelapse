var data = require('./data'),
    scrape = require('./scrape'),
    video = require('./video'),
    gif = require('./gif'),
    Q = require('Q'),
    config = require('../config.json'),
    suncalc = require('suncalc');


exports.tick = function() {
    console.log('consume video files');
    var videosList = [];

    data.list()
        //////////////////
        // Scrap Images //
        //////////////////
        .then(function(list) {

            videosList = list;

            var imageData = videosList.filter(function(video) {
                    return isWebcamSunny(video);
                })
                .map(function(video) {
                    return {
                        id: video._id,
                        step: video.step,
                        url: video.image_url,
                        destination: config.output.photo + video.directory + '/' + video.step + '.jpg',
                        last: video.step > 1 ? config.output.photo + video.directory + '/' + (video.step - 1) + '.jpg' : null
                    };
                });
            return buildQueue(scrape.it, imageData);
        })
        /////////////////
        // Render Gifs //
        /////////////////
        .then(function() {

            var gifData = videosList.filter(function(video) {
                    return isWebcamSunny(video) && (video.step % config.gif.fps === 0 || config.gif.forceRender) && video.step > 0;
                })
                .map(function(video) {
                    return {
                        step: video.step,
                        photosLocation: config.output.photo + video.directory,
                        destination: config.output.gif + video.start_time + '.' + config.gif.type
                    };
                });
            return buildQueue(gif.render, gifData);
        })
        ///////////////////
        // Render videos //
        ///////////////////
        .then(function() {

            var videoData = videosList.filter(function(video) {
                    return isWebcamSunny(video) && (video.step % config.video.fps === 0 || config.video.forceRender) && video.step > 0;
                })
                .map(function(video) {
                    return {
                        step:video.step,
                        photosLocation: config.output.photo + video.directory,
                        destination: config.output.video + video.start_time + '.' + config.video.type
                    };
                });
            return buildQueue(video.render, videoData);
        })
        .then(function() {
            console.log('--------');
        })
        .fail(function(err) {
            console.log('error during consume: %s', err);
        });
};

/* Schedules all jobs in a sequence */
function buildQueue(funct,list) {
    var promises = [];

    var result = Q();

    list.forEach(function(item) {
        result = result.then(function(){
            return funct(item);
        });
    });
    return result;
}
/* Schedules all jobs at the same time.
function buildQueue(funct,list) {
    var promises = [];

    list.forEach(function(item) {
        promises.push(funct(item));
    });
    return Q.all(promises);
}
 */

function isWebcamSunny(video) {
    var now = new Date().getHours();
    var times = suncalc.getTimes(new Date(), video.latitude, video.longitude);
    return video.ignoreDarkness || now >= new Date(times.sunrise).getHours() - 1 && now <= new Date(times.sunset).getHours() + 1;
}