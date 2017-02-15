var mongoose = require('mongoose');
var url = require('url');
var eventproxy = require('eventproxy');

var follow = require('../model/follow').follow;
var article = require('../model/article').article;
var argument = require('../model/argument').argument;

exports.getFollowList = function (req, res) {
	if (!req.session.data) {
		res.send('0');
		return;
	}

	var docLen = 0;
	var user_name = req.session.data.user_name;
	follow.find({create_by: user_name})
		.populate('post','title author')
		.exec(function(err, doc){
			var ep = new eventproxy();
			ep.after('data', doc.length, function (data) {
				res.send(data);
			});
			doc.forEach(function (val, index) {
				argument.count({ article_id: doc[index].post._id }).exec(function (err, arg) {
					follow.count({ article_id: doc[index].post._id }).exec(function (err, fo) {
						ep.emit('data', {
							title: doc[index].post.title,
							argCount: arg,
							folCount: fo,
							isFollow: 1
						});
					});					
				});
			});
		});

	
}

//关注 | 取消关注
exports.follow = function (req, res) {
	if (!req.session.data) {
		res.send('0');
		return;
	}

	var article_id = req.body.article_id;
	var query = { article_id: article_id, create_by: req.session.data.user_name, post: article_id }

	follow.findOne(query, function (err, doc) {
		if (doc) {
			follow.remove(query, function (err) {
				res.send('-1');
			});
			
			return;
		}

		new follow(query).save(function (err, doc) {
			res.send('1');
		})
	})
}