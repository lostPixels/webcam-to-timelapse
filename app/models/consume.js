var data = require('./data'),
    scrape = require('./scrape'),
    Q = require('Q');


exports.tick = function() {
    console.log('consume video files');

    data.list()
        .then(function(videosList) {

            var list = videosList.map(function(video) {
                return {
                    url: video.image_url,
                    destination: video.directory + '/' + video.step + '.jpg',
                    last: video.step > 1 ? video.directory + '/' + (video.step - 1) + '.jpg' : null
                };
            });
            return fetchImages(list);
        })
        .then(function(){
            console.log('all images loaded.');
        })
        .fail(function(err){
            console.log('error fetching images: ',err);
        });
};

function fetchImages(list) {

    console.log('fetch images:',list.length);

    var promises = [];
    list.forEach(function(item) {
        promises.push(scrape.it(item));
    });
    return Q.all(promises);
}