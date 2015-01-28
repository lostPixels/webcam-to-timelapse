var Q = require('q'),
    fs = require('fs'),
    request = require('request'),
    files = require('./files'),
    data = require('./data'),
    config = require('../config.json');

Q.longStackSupport = true;

exports.it = function(opts) {
    var deferred = Q.defer();
    getImage(opts.url)
        .then(function(results) {
            return saveFile(results.res, results.body, opts);
        })
        .then(function() {
            data.update(opts.id, {
                step: (opts.step + 1)
            });
        })
        .catch(function(err) {
            console.log(err, opts.url);
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
            fs.writeFile(opts.destination, body, 'binary', deferred.makeNodeResolver());
        } else {
            deferred.reject(new Error('Duplicate Image Found'));
        }

    } else {
        deferred.reject(new Error('Corrupt Image Found'));
    }
    return deferred.promise;
}

function verify(type, size) {
    return (type === 'image/jpg' || type === 'image/jpeg') && size > 3000;
}

function getImage(url) {

    var deferred = Q.defer();

    request.get({
        url: url,
        encoding: 'binary'
    }, function(err, response, body) {
        if (!err) {
            deferred.resolve({res:response,body: body});
        } else {
            deferred.reject(err);
        }
    });
    return deferred.promise;
}

function updateStep() {

}