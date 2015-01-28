var data = require('./models/data'),
    config = require('./config'),
    express = require('express'),
    files = require('./models/files');

exports.init = function(app) {

    var router = express.Router();

    router.get('/', function(req, res) {
        data.list().then(function(videos) {
            res.render('home', {
                gifFolder: config.output.gif,
                videoList: videos
            });
        });
    });

    router.get('/api/videos', function(req, res) {

        data.list()
            .then(function(videos) {
                if (videos) {
                    res.send(JSON.stringify(videos));
                }
            });
    });

    router.get('/api/videos/:video_id', function(req, res) {
        data.find(req.params.video_id)
            .then(function(vidResult) {
                console.log('show video', vidResult);
                res.render('detail', {
                    video: vidResult
                });
            })
            .fail(function(err) {
                res.status(404);
            });
    });

    router.post('/api/videos', function(req, res) {

        var name = req.body.name;
        var image_url = req.body.image_url;
        var address = req.body.address;
        var darkness = req.body.ignoreDarkness;

        data.create({
                name: name,
                image_url: image_url,
                address: address,
                ignoreDarkness: darkness
            })
            .then(function() {
                res.redirect('/');
            })
            .fail(function() {
                res.status(500);
            });
    });

    router.get('/api/videos/:video_id/reset', function(req, res) {

        var directoryToClear = '';

        data.find(req.params.video_id)
            .then(function(video) {
                directoryToClear = config.output.photo + video.directory;
                files.rmDirectory(directoryToClear,false);
                return data.update(video._id,{
                    step: 0
                });
            })
            .then(function() {
                res.redirect('/api/videos/'+req.params.video_id);
            })
            .fail(function(err) {
                console.log('error: ',err);
                res.status(500);
            });
    });

    router.get('/api/videos/:video_id/delete', function(req, res) {

        var directoryToClear = '';

        data.find(req.params.video_id)
            .then(function(video) {
                directoryToClear = config.output.photo + video.directory;
                return data.delete(req.params.video_id);
            })
            .then(function() {
                files.rmDirectory(directoryToClear,true);
                res.redirect('/');
            })
            .fail(function(err) {
                console.log('error: ',err);
                res.status(500);
            });
    });

    app.use('/', router);
};