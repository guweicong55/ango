var mongoose = require('mongoose');
var url = require('url');
var eventproxy = require('eventproxy');

var user = require('../model/user').user;
var onfocus = require('../model/onfocus').onfocus;
var follow = require('../model/follow').follow;
var article = require('../model/article').article;
var argument = require('../model/argument').argument;

//获取个人主页信息
exports.personalInfo = function (req, res) {
	var name = url.parse(req.url, true).query.name;
	user.findOne({ user_name: name }, 'user_name email').exec(function (err, doc) {
		var resDate = {};

		if (doc) {
			resDate.data = doc;
			if (req.session.data) {
				if (name == req.session.data.user_name) {
					resDate.isEdit = 1;
					res.send(resDate);
				} else {
					resDate.isEdit = 0;
					onfocus.findOne({ from: req.session.data.user_name, to: name }).exec(function (err, isF) {
						if (isF) {
							resDate.isFocus = 1;
							res.send(resDate);
						} else {
							resDate.isFocus = 0;
							res.send(resDate);
						}
					})
				}
			} else {
				resDate.isEdit = 0;
				resDate.isFocus = 0;
				res.send(resDate);
			};
		} else {
			res.send('0');
		}		
	});	
}

//关注用户
exports.onfocusPersonal = function (req, res) {
	if (!req.session.data) {
		res.send('0');
		return;
	}

	var userName = req.session.data.user_name;
	var reqData = req.body;

	if (userName != reqData.name) {
		user.findOne({ user_name: userName }, '_id').exec(function (err, doc) {
			if (doc) {
				onfocus.findOne({ from: userName, to: reqData.name }).exec(function (err, onData) {
					if (onData) {
						onfocus.remove({ from: userName, to: reqData.name }).exec(function (err, del) {
							if (del) {
								res.send('-1');
							}
						});
					} else {
						new onfocus({
							from: userName,
							to: reqData.name,
							from_id: doc._id,
							to_id: reqData.id
						}).save(function (err, succ) {
							if (succ) {
								res.send('+1');
							}
						});
					}
				});
			} else {
				res.send('0');
			}
		});
	} else {
		res.send('自己关注自己，你要搞事情啊？');
	}	
}

//个人中心 | 提问
exports.personalArticle = function (req, res) {
	var user = url.parse(req.url, true).query.user;
	
	article.find({author: user}, 'title')
		.exec(function(err, doc){
			var ep = new eventproxy();
			ep.after('data', doc.length, function (data) {
				res.send(data);
			});
			doc.forEach(function (val, index) {				
				argument.count({ article_id: val._id }).exec(function (err, arg) {
					follow.count({ article_id: val._id }).exec(function (err, fo) {
						ep.emit('data', {
							id: val._id,
							title: val.title,
							argCount: arg,
							folCount: fo,
						});
					});					
				});
			});
		});	
}

//个人中心 | 关注的人
exports.myFocus = function (req, res) {
	var name = url.parse(req.url, true).query.name;

	onfocus.find({ from: name }, 'to').exec(function (err, doc) {
		if (doc.length > 0) {
			var ep = new eventproxy();
			ep.after('myFocusInfo', doc.length, function (data) {
				res.send(data);
			});
			doc.forEach(function (val, index) {
				argument.count({ author: val.to }, function (err, argCount) {
					article.count({ author: val.to }, function (err, artCount) {
						onfocus.count({ to: val.to }, function (err, foCount) {
							ep.emit('myFocusInfo', {
								name: val.to,
								argument: argCount,
								article: artCount,
								onfocus: foCount
							});
						});
					});
				});
			});
			return;
		}
		res.send('0');
	});
}

//个人中心 | 关注的文章
exports.myFollowArticle = function (req, res) {

	var user_name = url.parse(req.url, true).query.name;
	follow.find({create_by: user_name})
		.populate('post','title author')
		.exec(function(err, doc){
			if (doc.length > 0) {
				var ep = new eventproxy();
				ep.after('data', doc.length, function (data) {
					res.send(data);
				});
				doc.forEach(function (val, index) {				
					argument.count({ article_id: val.post._id }).exec(function (err, arg) {
						follow.count({ article_id: val.post._id }).exec(function (err, fo) {
							ep.emit('data', {
								id: val.post._id,
								title: val.post.title,
								argCount: arg,
								folCount: fo,
							});
						});					
					});
				});
				return;
			}
			res.send('0');
		});
}