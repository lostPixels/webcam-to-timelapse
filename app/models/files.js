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

    if (!fs.existsSync(file)) {
        return false;
    } else {
        var stats = fs.statSync(file);
        return stats['size'];
    }
};

exports.rmDirectory = function(dirPath,deleteFolderToo) {
    try {
        var files = fs.readdirSync(dirPath);
    } catch (e) {
        return;
    }
    console.log('clear directory: %s which contains %s files',dirPath,files.length);
    if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
            var filePath = dirPath + '/' + files[i];
            if (fs.statSync(filePath).isFile())
                fs.unlinkSync(filePath);
            else
                rmDir(filePath);
        }
    if(deleteFolderToo){
        fs.rmdirSync(dirPath);
    }
}