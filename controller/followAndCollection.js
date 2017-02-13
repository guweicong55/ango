var mongoose = require('mongoose');
var url = require('url');

var follow = require('../model/follow').follow;

/*exports.getFollowList = function (req, res) {
	var creat_by = url.parse(req.url, true).qurey;


}*/

//关注 | 取消关注
exports.follow = function (req, res) {
	if (!req.session.data) {
		res.send('未登录');
		return;
	}

	var article_id = req.body.article_id;
	var query = { article_id: article_id, create_by: req.session.data.user_name }

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