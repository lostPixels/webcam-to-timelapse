var data = require('./models/data'),
    config = require('./config'),
    express = require('express');

exports.init = function(app) {

    var router = express.Router();

    router.get('/', function(req, res) {
        data.list().then(function(videos) {
            res.render('home', {
                videoFolder:config.output.video,
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
        console.log(req.params.video_id)
        data.find(req.params.video_id)
        .then(function(vidResult) {
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

    app.use('/', router);
};



// app.get('/api/videos/:video_id', function(req, res) {

//     var list = api.find(req.params.video_id).then(function(vidResult) {
//         res.render('detail', {
//             video: vidResult
//         });
//     }).fail(function(err) {
//         res.status(404);
//     });
// });

// app.get('/api/videos/:video_id/reset', function(req, res) {

//     var folder_id = req.params.video_id;

//     var list = api.update(folder_id, {
//         step: 0
//     }).then(function(vidResult) {
//         console.log('video views reset, removing files...',vidResult);
//         files.clearPhotoFolder(vidResult.directory);
//         res.send({
//             status: "success"
//         });
//     }).fail(function(err) {
//         res.status(404);
//     });
// });

// app.get('/api/address/:address', function(req, res) {

//     var coords = geo.getCoords(req.params.address);

//     coords.then(function(results) {
//         console.log(results);
//         res.status(200).send(results);
//     });
// });

// app.post('/api/videos', function(req, res) {

//     var name = req.body.name;
//     var image_url = req.body.image_url;
//     var address = req.body.address;
//     var darkness = req.body.ignoreDarkness;

//     if (is_valid_url(image_url)) {
//         var video = api.create({
//             name: name,
//             image_url: image_url,
//             address: address,
//             ignoreDarkness:darkness
//         });

//         if (video) {
//             res.send({
//                 status: "success"
//             });
//         } else {
//             res.send({
//                 status: "error"
//             });
//         }
//     } else {
//         res.send({
//             status: "bad_url"
//         });
//     }
// });