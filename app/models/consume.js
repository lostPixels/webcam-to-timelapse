var data = require('./data'),
    scrape = require('./scrape'),
    Q = require('Q'),
    config = require('../config.json');


exports.tick = function() {
    console.log('consume video files');

    data.list()
        .then(function(videosList) {

            var list = videosList.map(function(video) {
                return {
                    id: video._id,
                    step: video.step,
                    url: video.image_url,
                    destination: config.photoFolder + video.directory + '/' + video.step + '.jpg',
                    last: video.step > 1 ? config.photoFolder + video.directory + '/' + (video.step - 1) + '.jpg' : null
                };
            });
            return fetchImages(list);
        })
        .then(function() {
            //console.log('all images loaded.');
        })
        .fail(function(err) {
            console.log('error fetching images: ', err);
        });
};

function fetchImages(list) {

    console.log('fetch images:', list.length);

    var promises = [];
    list.forEach(function(item) {
        promises.push(scrape.it(item));
    });
    return Q.all(promises);
}