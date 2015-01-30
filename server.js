var express = require('express'),
    exphbs = require('express-handlebars'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    hbshelpers = require('./app/models/handlebars-helpers'),
    routes = require('./app/routes'),
    consume = require('./app/models/consume');

var app = express();

var hbs = exphbs.create({
    defaultLayout: 'main',
    helpers: {
        date: hbshelpers.renderDate,
        renderStep: hbshelpers.renderStep,
        encoded: hbshelpers.encoded
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use("/assets", express.static(__dirname + '/public/assets'));
app.use("/photos", express.static(__dirname + '/public/photos'));
app.use("/videos", express.static(__dirname + '/public/videos'));
app.use("/gifs", express.static(__dirname + '/public/gifs'));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

consume.tick();
var kickInt = setInterval(function() {
    consume.tick();
}, 60000);

routes.init(app);

mongoose.connect('mongodb://localhost/timelapse');

app.listen(1337);