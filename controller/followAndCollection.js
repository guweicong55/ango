var mongoose = require('mongoose');
var url = require('url');

var follow = require('../model/follow').follow;
var article = require('../model/article').article;

exports.getFollowList = function (req, res) {
	if (!req.session.data) {
		res.send('0');
		return;
	}
	
	var resData = [];
	var user_name = req.session.data.user_name;
	follow.find({create_by: user_name})
		.populate('post','title content')
		.exec(function(err, doc){
			res.send(doc);
		});

}

//关注 | 取消关注
exports.follow = function (req, res) {
	if (!req.session.data) {
		res.send('0');
		return;
	}

	var article_id = req.body.article_id;
	var query = { article_id: article_id, create_by: req.session.data.user_name, post: { _id: article_id } }

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