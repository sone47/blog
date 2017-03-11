var mongoose = require('mongoose');
var Message = require('../models/message');

// 获取页面
exports.index = index;
exports.about = about;
exports.article = article;
exports.project = project;
// 发送留言
exports.postMessage = postMessage;
//获取留言
exports.getMessage = getMessage;

// 获取页面
function index(req, res) {
	res.render('index');
}

function about(req, res) {
	res.render('about');
}

function article(req, res) {
	res.render('article');
}

function project(req, res) {
	res.render('project');
}

// 发送留言
function postMessage(req, res) {
	var body = req.body;
	var message = new Message({
		createTime: body.createTime,
		content: body.content,
		name: body.name,
		email: body.email
	});

	message
		.save(function(err, message) {
			if(err) res.send('2');
			res.send('1');
		});
}

//获取留言
function getMessage(req, res) {
	var messages = Message.find({}, function(err, data) {
		if(err) res.send('2');

		res.send(data);
	});
}