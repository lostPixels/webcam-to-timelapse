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
            var imageList = videosList.map(function(video) {
                return {
                    isSunny: isWebcamSunny(video),
                    id: video._id,
                    step: video.step,
                    url: video.image_url,
                    destination: config.photoFolder + video.directory + '/' + video.step + '.jpg',
                    last: video.step > 1 ? config.photoFolder + video.directory + '/' + (video.step - 1) + '.jpg' : null
                };
            });
            return fetchImages(imageList);
        })
        .then(function() {
            return renderVideos(videosList);
        })
        .then(function(){
            console.log('rendered videos');
        })
        .fail(function(err) {
            console.log('error fetching images: ', err);
        });
};

function fetchImages(list) {
    var promises = [];
    list.forEach(function(item) {
        if(item.isSunny){
            promises.push(scrape.it(item));
        }
    });
    return Q.all(promises);
}

function renderVideos(list) {
    var promises = [];
    list.forEach(function(item) {
        if(item.isSunny){
            promises.push(video.render(item));
        }
    });
    console.log('render video list: ',list.length);
    return Q.all(promises);
}

function isWebcamSunny(video){
    var now = new Date().getHours();
    var times = suncalc.getTimes(new Date(), video.latitude, video.longitude);
    return video.ignoreDarkness || now >= new Date(times.sunrise).getHours() - 1 && now <= new Date(times.sunset).getHours() + 1
}