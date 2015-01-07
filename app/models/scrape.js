var Q = require('q'),
    fs = require('fs'),
    request = require('request'),
    files = require('./files'),
    config = require('../config.json');

Q.longStackSupport = true;

exports.it = function(opts) {
    var deferred = Q.defer();

    // request.get({
    //     url: opts.url,
    //     encoding: 'binary'
    // }, function(err, res, body) {
    //     if (!err) {
    //         saveFile(res, body, opts)
    //             .then(function() {
    //                 deferred.resolve();
    //             })
    //             .fail(function(err) {
    //                 deferred.reject(new Error(err));
    //             });
    //     } else {
    //         deferred.reject(err);
    //     }
    // });

    var get = Q.denodeify(request.get);

    getImage(opts.url)
        .then(function(res, body) {
            return saveFile(res, body, opts);
        })
        .catch(function(err) {
            console.log('error downloading image: ', err);
        })
        .finally(function() {
            deferred.resolve();
        });

    return deferred.promise;
};

function saveFile(res, body, opts) {

    var previousFilesSize = files.getFileSize(opts.last);
    var fileSize = body.length;
    var deferred = Q.defer();

    if (verify(res.headers['content-type'], fileSize)) {

        if (!previousFilesSize || previousFilesSize !== fileSize) {
            console.log('save file to:  ', opts.destination);
            fs.writeFile(config.photoFolder + opts.destination, body, 'binary', deferred.makeNodeResolver());
        }

    } else {
        deferred.reject(new Error('Corrupt Image Found'));
    }
    return deferred.promise;
}

function verify(type, size) {
    return type === 'image/jpg' || type === 'image/jpeg' && size > 3000;
}

function getImage(url) {

    var deferred = Q.defer();

    request.get({
        url: url,
        encoding: 'binary'
    }, function(err, res, body) {
        console.log('image loaded: ',res,body);
        if (!err) {
            deferred.resolve(res, body);
        } else {
            deferred.reject(err);
        }
    });
    return deferred.promise;
}