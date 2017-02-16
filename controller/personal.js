var mongoose = require('mongoose');
var url = require('url');

var user = require('../model/user').user;
var onfocus = require('../model/onfocus').onfocus;

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