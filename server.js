var express = require('express'),
    exphbs = require('express-handlebars'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    hbshelpers = require('./app/models/handlebars-helpers'),
    routes = require('./app/routes');

    // api = require('./models/api'),
    // Q = require('q'),
    // bodyParser = require('body-parser'),
    // creator = require('./create-video'),
    // geo = require('./models/geo'),
    // files = require('./models/files');


var app = express();

var hbs = exphbs.create({
    defaultLayout: 'main',
    helpers: {
        date: hbshelpers.renderDate,
        renderStep: hbshelpers.renderStep
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use("/assets", express.static(__dirname + '/public/assets'));
app.use("/photos", express.static(__dirname + '/public/photos'));
app.use("/videos", express.static(__dirname + '/public/videos'));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

// if (!process.env.OPENSHIFT_NODEJS_PORT) {
//     creator.kickOff();
//     console.log('Kickoff cron job');
//     var kickInt = setInterval(function() {
//         creator.kickOff();
//     }, 60000);
// }

routes.init(app);

mongoose.connect('mongodb://localhost/timelapse');

app.listen(1337);