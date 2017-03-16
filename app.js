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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'sones blog',
  resave: false,
  saveUninitialized: true,
  cookie: {
    
  }
}))

app.get('/', router.index);
app.get('/about', router.about);
app.get('/article', router.article);
app.get('/project', router.project);
app.get('/admin', router.admin);
app.post('/admin', router.adminLogin);
app.get('/logout', router.adminLogout);
app.post('/message', router.postMessage);
app.post('/deletemsg', router.deleteMsg);

mongoose.connect('mongodb://localhost/blog', function(err) {
	if(err) {
		console.error.bind(console, 'connection error');
	} else {
    console.log('connection success');
    app.listen(3000);
  }
});