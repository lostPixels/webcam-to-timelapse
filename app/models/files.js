var fs = require('fs'),
    Q = require('q'),
    config = require('../config.json');


exports.createFolder = function(folderID) {

    var deferred = Q.defer(),
        dirName = config.photoFolder + folderID;

    fs.mkdir(dirName, deferred.makeNodeResolver());

    return deferred.promise;
};

exports.getFileSize = function(file) {

    if(!fs.existsSync(file)){
        return false;
    }
    else{
        var stats = fs.statSync(file);
        return stats['size'];
    }
};