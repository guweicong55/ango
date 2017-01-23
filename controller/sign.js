var mongoose = require('mongoose');
var moment = require('moment');
var validator = require('validator');
var eventproxy = require('eventproxy');
var bcrypt = require('bcryptjs');

var user = require('../model/user').user;
var tool = require('../common/tool');

exports.main = function (req, res) {

	res.send(moment().format('YYYY-MM-DD HH:mm:ss'));
}

// 注册模块
exports.signUp = function (req, res) {
	// 获取表单信息
	var ip = req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress;
	var data = req.body;
	var user_name = validator.trim(data.username).toLowerCase();
	var email = validator.trim(data.email).toLowerCase();
	var password = validator.trim(data.password);
	
	var ep = new eventproxy();
	ep.on('reg_err', function (msg) {
		res.send(msg);
	});

	// START 验证信息是否合法
	// 注册事件必须添加return  否则会返回多个headers 报错
	if (user_name === '' || email === '' || password === '') {
		ep.emit('reg_err', '信息不完整。');
		return;
	}
	if (user_name.length < 6) {
		ep.emit('reg_err', '用户名长度必须大于6位。');
		return;
	}
	if (validator.isEmail(user_name)) {
		ep.emit('reg_err', '用户名不能为邮箱。');
		return;
	}
	if (!validator.isEmail(email)) {
		ep.emit('reg_err', '请输入合法邮箱。');
		return;
	};
	// END 验证信息是否合法	


	// 检查user_name和email是否被占用
	user.find({'$or': [
		{ 'user_name': user_name },
		{ 'email': email }
	]}, function (err, doc) {
		if (err) {
			console.log(err);
		} else if (doc.length > 0) {
			res.send('用户名或邮箱已经被使用。');
		} else if (doc.length === 0) {

			// 用户信息入库
			// 密码加密
			tool.beHash(password, function (err, hash) {
				if (err) {
					console.log(err + '密码加密失败。');
				} else {
					console.log(ip);
					new user({
						user_name: user_name,
						email: email,
						password: hash,
						reg_ip: ip
					}).save(function  (err) {
						if (!err) {
							res.send('注册成功。');
						} else {
							console.log(err);			
						}
					});

					//发送邮件
					//tool.sendEmail(email, '账号注册成功', '<h1>hello world</h1>');
				}
			})
			
		}
	});
}

// 登录模块账号邮箱均可以登录
exports.signIn = function (req, res) {
	var data = req.body;
	var account = validator.trim(data.account).toLowerCase();
	var password = validator.trim(data.password);

	user.find({'$or': [{
		email: account
	}, {
		user_name: account
	}]}, function (err, doc) {
		if (err) {
			console.log('登录失败' + err);
		} else if (doc.length === 0) {
			res.send('用户不存在');
		} else if (doc.length > 0) {
			if (tool.mkCompare(password, doc[0].password)) {
				//req.session.user = account;
				res.send('登录成功');
			} else {
				res.send('密码错误');
			};
		};
	});
}