var mongoose = require('mongoose');
var url = require('url');
var eventproxy = require('eventproxy');

var article = require('../model/article').article;
var user = require('../model/user').user;

module.exports = function (req, res) {
	var searchVal = url.parse(req.url, true).query.val;
	if (!searchVal) {
		res.send('0');
		return;
	};

	var reg = new RegExp(searchVal, 'i');
	var resData = {};

	article.find({ title:  { $regex: reg }})
	.sort({ push: 1 })
	.limit(3)
	.exec(function (err, articleData) {
		user.find({ user_name: { $regex: reg } })
		.limit(3)
		.exec(function (err, userData) {
			resData.user = userData;
			resData.article = articleData;
			res.send(resData);
		})
	});
}