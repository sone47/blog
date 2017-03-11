var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var db = mongoose.connection;

var router = require('./routers/router.js');

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', router.index);
app.get('/about', router.about);
app.get('/article', router.article);
app.get('/project', router.project);
app.post('/message', router.postMessage);
app.get('/message', router.getMessage);

mongoose.connect('mongodb://localhost/blog');

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {
	console.log('connection success');
});

app.listen(3000);