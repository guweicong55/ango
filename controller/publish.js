var mongoose = require('mongoose');
var moment = require('moment');
var validator = require('validator');
var eventproxy = require('eventproxy');

var article = require('../model/article').article;
var argument = require('../model/argument').argument;
var praise = require('../model/praise').praise;

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

//获取具体文章内容以及评论
exports.details = function (req, res) {
	var id = req.body.id;
	var reslove = {
		article: null,
		arguments: null
	};

	var ep = new eventproxy();
	ep.on('details', function (fn) {
		fn();
	});

	article.findById(id, function (err, doc) {
		ep.emit('details', function () {
			if (err) {
				console.log(err);
				return;
			}
			reslove['article'] = doc;
		});		
	});

	praise.find({ article_id: id }, function (err, doc) {
		ep.emit('details', function () {
			if (err) {
				console.log(err);
				return;
			}
			reslove['praise'] = doc;
		});
	});

	argument.find({ article_id: id }, function (err, doc) {
		ep.emit('details', function () {
			if (err) {
				console.log(err);
				return;
			}
			reslove['arguments'] = doc;
			res.send(reslove);
		});		
	});
	
}

//提交评论
exports.argument = function (req, res) {
	if (!req.session.data) {
		res.send('您还未登录');
		return;
	}

	var data = req.body;
	if (data.content === '') {
		res.send('内容不能为空');
		return;
	}

	new argument({
		author: req.session.data.user_name,
		content: data.content,
		article_id: data.id
	}).save(function (err) {
		if (err) {
			console.log(err);
			res.send('提交评论失败');
			return;
		}

		res.send({
			state: '1',
			user: req.session.data.user_name
		});
	});
}

//点赞/踩
exports.praise = function (req, res) {
	if (!req.session.data) {
		res.send('请先登录');
		return;
	}

	//检查是否已经点过赞/踩
	praise.find({'$and': [
		{ author: req.session.data.user_name },
		{ article_id: req.body.id }
	]}, function (err, doc) {
		if (err) {
			console.log(err);
			return;
		}

		if (doc.length > 0) {
			res.send('你已经赞/踩过');
			return;
		}

		if (doc.length === 0) {
			new praise ({
				author: req.session.data.user_name,
				article_id: req.body.id,
				is_good: req.body.is_good
			}).save(function (err) {
				if (err) {
					console.log(err);
					return;
				}

				//每插入一条数据，更新相关文章的push或step字段（自增+1）
				if (req.body.is_good === 1) {
					article.update({
						_id: req.body.id
					}, { 
						$inc:{ push: 1 }						
					}, function (err) {
						if (err) {
							console.log(err);
						}
					});
				} else {
					article.update({
						_id: req.body.id
					}, {
						$inc:{ step: 1 }
					}, function (err) {
						if (err) {
							console.log(err);
						}
					});
				}

				res.send('1');
			})
		}
	})
}
