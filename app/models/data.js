var mongoose = require('mongoose'),
    Q = require('q'),
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