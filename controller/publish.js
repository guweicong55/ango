var mongoose = require('mongoose');
var moment = require('moment');
var validator = require('validator');

var article = require('../model/article').article;

// 发布文章
exports.publish = function (req, res) {
	var user = req.session.data;
	if (!user) {
		res.send('未登录');
		return;
	}

	var data = req.body;
	if (data.aTitle === '' || data.aContent === '' || data.aType === '') {
		res.send('标题,内容和文章类型不能为空');
		return;
	}

	new article({
		title: data.aTitle,
		content: data.aContent,
		author: user.user_name,
		article_type: data.aType
	}).save(function (err) {
		if (err) {
			res.send('发布失败');
			console.log('文章储存失败' + err);
		} else {
			res.send('文章发布成功');
		};
	});
}

//获取文章列表
exports.articleList = function (req, res) {
	article.find({}, function (err, doc) {
		if (err) {
			console.log(err);
			return;
		}
		res.send(doc);
	});
}