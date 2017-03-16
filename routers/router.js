var mongoose = require('mongoose');
var Message = require('../models/message');

var adminInfo = require('../models/admin');

// 获取页面
exports.index = index;
exports.about = about;
exports.article = article;
exports.project = project;
exports.admin = admin;
// 管理员登录
exports.adminLogin = adminLogin;
// 管理员退出登录
exports.adminLogout = adminLogout;
// 发送留言
exports.postMessage = postMessage;
// 删除留言
exports.deleteMsg = deleteMsg;

// 获取页面
function index(req, res) {
  Message.find({}).sort({ createTime: -1 }).exec(function(err, messages) {
    if(err) {
      res.send('2');
    }

    var data = {};
    data.messages = messages;
    data.login = req.session.login;

    res.render('index', data);
  });
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
function admin(req, res) {
  res.render('admin', {
    login: req.session.login
  });
}

// 管理员登录
function adminLogin(req, res) {
  var body = req.body;
  var session = req.session;

  if(body.name === adminInfo.name && body.password === adminInfo.password) {
    req.session.name = body.name;
    req.session.password = body.password;
    req.session.login = true;

    res.json({code: 0, msg: '登录成功'});
  } else {
    res.json({code: 1, msg: '管理员账号或密码错误'});
  }
}

// 管理员退出登录
function adminLogout(req, res) {
  req.session.login = false;
  req.session.name = null;
  req.session.password = null;
  res.json({code: 0, msg: '已退出管理员账号'});
}

// 发送留言
function postMessage(req, res) {
  var body = req.body;
  var message = new Message({
    createTime: Date.now(),
    content: body.content,
    name: body.name,
    email: body.email
  });

  message
    .save(function(err, message) {
      if(err) {
        res.send('2');
        return;
      }
      res.send('1');
    });
}

// 删除留言
function deleteMsg(req, res) {
  if(req.session.login) {
    Message.remove({
      _id: new mongoose.Types.ObjectId(req.body.id)
    }, function(err) {
      if(err) {
        res.json({code: 2, msg: '服务器错误，删除失败'});
      }
      res.json({code: 0, msg: '删除成功'});
    });
  } else {
    res.json({code: 1, msg: '对不起，您不是管理员，不能执行此操作'});
  }
}