var mongoose = require('mongoose'),
    Q = require('q'),
    sanitize = require("sanitize-filename"),
    files = require('./files'),
    extend = require('extend'),
    geo = require('./geo');


var videoSchema = mongoose.Schema({
    id: Number,
    name: String,
    image_url: String,
    start_time: Number,
    directory: String,
    longitude: Number,
    latitude: Number,
    address: String,
    step: Number,
    ignoreDarkness: Boolean
});

var Video = mongoose.model('Video', videoSchema);

exports.list = function() {
    var deferred = Q.defer();

    Video.find(deferred.makeNodeResolver());

    return deferred.promise;
};

exports.find = function(id) {

    var deferred = Q.defer();

    Video.find({
        id: id
    }, deferred.makeNodeResolver());

    return deferred.promise;
};

exports.create = function(settings) {

    var deferred = Q.defer(),
        time = new Date().getTime(),
        folderName = sanitize(settings.name+'_' + time),
        folderInstance = files.createFolder(folderName);

    folderInstance
        .then(function() {
            return geo.getCoords(settings.address);
        })
        .then(function(coords) {

            var videoInstance = new Video({
                id: time,
                name: settings.name,
                image_url: settings.image_url,
                start_time: time,
                directory: folderName,
                longitude: coords.lng,
                latitude: coords.lat,
                address: settings.address,
                ignoreDarkness: settings.ignoreDarkness,
                step: 0
            });

            videoInstance.save(function(err, video) {
                if (!err) {
                    console.log('new video saved');
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            });
        })
        .fail(function(){
            deferred.reject();
        });

        return deferred.promise;
};