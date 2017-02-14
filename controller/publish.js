var mongoose = require('mongoose');
var moment = require('moment');
var validator = require('validator');
var eventproxy = require('eventproxy');
var url = require('url');

var article = require('../model/article').article;
var argument = require('../model/argument').argument;
var praise = require('../model/praise').praise;
var follow = require('../model/follow').follow;
var beJson = require('../common/tool').beJson;

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
	article.find({}).lean().exec(function (err, doc) {
    	var resData = beJson(doc);
    	var a = 0;
    	if (req.session.data) {
    		for (var s = 0; s < resData.length; s++) {
    			//要做的res.send()操作必须在follow.findOne的callback中，否则会出现未知的奇葩错误
    			//不可以写在for或者if中
    			follow.findOne({create_by: req.session.data.user_name, article_id: resData[s]._id}, function (err, doc) {    				
    				if (doc) {
    					resData[a].isFollow = 1;
    				} 

    				if (a == resData.length-1) {
	    				res.send(resData);
	    			}

	    			a++;	
    			});				
    		}
    	} else {
    		res.send(resData);
    	}
	});		
}

//获取具体文章内容
exports.details = function (req, res) {
	var id = url.parse(req.url, true).query.id;
	console.log(id);
	var reslove = {};

	article.findById(id, function (err, doc) {		
		if (err) {
			console.log(err);
			return;
		}
		reslove['article'] = doc;
		if (req.session.data) {
			praise.find({ article_id: id, author:req.session.data.user_name }, function (err, doc) {			
				if (err) {
					console.log(err);
					return;
				}

				if (doc.length > 0) {
					reslove['praise'] = doc[0].is_good;
				}	
				res.send(reslove);		
			});	
		} else {
			res.send(reslove);
		}	
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

		//如果已经点过赞，再点击取消赞
		if (doc.length > 0) {
			if (doc[0].is_good === req.body.is_good && req.body.is_good === 1) {
				praise.remove({'$and': [
					{ author: req.session.data.user_name },
					{ article_id: req.body.id }
				]}, function () {
					article.update({
						_id: req.body.id
					}, { 
						$inc:{ push: -1 }						
					}, function (err) {
						if (err) {
							console.log(err);
							return;
						}
						res.send('-1');
					});
				});
			} 
			//如果已经点过踩，再点击取消踩
			else if (doc[0].is_good === req.body.is_good && req.body.is_good === 0) {
				praise.remove({'$and': [
					{ author: req.session.data.user_name },
					{ article_id: req.body.id }
				]}, function () {
					article.update({
						_id: req.body.id
					}, { 
						$inc:{ step: -1 }						
					}, function (err) {
						if (err) {
							console.log(err);
							return;
						}
						res.send('-0');
					});
				});
				
			} 
			//如果已经点过赞，再点击踩，将赞转为踩 is_good = 0
			else if (doc[0].is_good === 1 && req.body.is_good === 0) {
				praise.update({'$and': [
					{ author: req.session.data.user_name },
					{ article_id: req.body.id }
				]}, {
					$set: {	is_good: 0 }
				}, function () {
					article.update({
						_id: req.body.id
					}, { 
						$inc:{ step: 1, push: -1 }						
					}, function (err) {
						if (err) {
							console.log(err);
							return;
						}
						res.send('=0');
					});
				});
			} 
			//如果已经点过踩，再点击赞，将踩转为赞 is_good = 1
			else if (doc[0].is_good === 0 && req.body.is_good === 1) {
				praise.update({'$and': [
					{ author: req.session.data.user_name },
					{ article_id: req.body.id }
				]}, {
					$set: {	is_good: 1 }
				}, function () {
					article.update({
						_id: req.body.id
					}, { 
						$inc:{ step: -1, push: 1 }					
					}, function (err) {
						if (err) {
							console.log(err);
							return;
						}
						res.send('=1');
					});
				});
			}
 							
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

//获取某一页的评论
exports.getArgument = function (req, res) {
	var reslove = {};
	var data = url.parse(req.url, true).query;
	var ep = new eventproxy();
	ep.on('arr', function (fn) {
		fn();
	});

	//获取评论总条数
	argument.count({ article_id: data.id }, function (err, count) {
		ep.emit('arr', function () {
			reslove['count'] = count;
		});
	});

	//获取评论
	argument.find({ article_id: data.id })
	.sort({ create_at: -1 })
	.limit(10*data.count)
	.skip(10*(data.count-1))
	.exec(function (err, doc) {
		ep.emit('arr', function () {
			reslove['data'] = doc;
			res.send(reslove);
		});		
	});
}