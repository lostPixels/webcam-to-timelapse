var data = require('./data'),
    scrape = require('./scrape'),
    video = require('./video'),
    Q = require('Q'),
    config = require('../config.json'),
    suncalc = require('suncalc');


exports.tick = function() {
    console.log('consume video files');
    var videosList = [];

    data.list()
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
                        last: video.step > 1 ? config.photoFolder + video.directory + '/' + (video.step - 1) + '.jpg' : null
                    };
                });
            return buildQueue(scrape.it, imageData);
        })
        .then(function() {

            var videoData = videosList.filter(function(video) {
                    return isWebcamSunny(video) && (video.step % config.video.fps === 0 || config.video.forceRender);
                })
                .map(function(video) {
                    return {
                        isSunny: isWebcamSunny(video),
                        step: video.step,
                        photosLocation: config.output.photo + video.directory,
                        destination: config.output.video + video.start_time + '.' + config.video.type
                    };
                });
            return buildQueue(video.render, videoData);
        })
        .then(function() {
            //console.log('Queue complete.');
        })
        .fail(function(err) {
            console.log('error fetching images: ', err);
        });
};

function buildQueue(funct,list) {
    var promises = [];
    list.forEach(function(item) {
        promises.push(funct(item));
    });
    return Q.all(promises);
}

// function fetchImages(list) {
//     var promises = [];
//     list.forEach(function(item) {
//         promises.push(scrape.it(item));
//     });
//     return Q.all(promises);
// }

// function renderVideos(list) {
//     var promises = [];
//     list.forEach(function(item) {
//         if (item.isSunny) {
//             promises.push(video.render(item));
//         }
//     });
//     return Q.all(promises);
// }

function isWebcamSunny(video) {
    var now = new Date().getHours();
    var times = suncalc.getTimes(new Date(), video.latitude, video.longitude);
    return video.ignoreDarkness || now >= new Date(times.sunrise).getHours() - 1 && now <= new Date(times.sunset).getHours() + 1
}