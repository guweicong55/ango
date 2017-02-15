var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var moment = require('moment');
var argument = require('./argument').argument;

var article = new Schema({
	title: 			{ type: String },							//标题
	content: 		{ type: String },							//内容
	article_type: 	{ type: String },							//类型
	author: 		{ type: String },							//作者
	create_at: 		{ type: Number, default: Date.now },		//创建时间
	push: 			{ type: Number, default: 0 },    			//赞同
	step: 			{ type: Number, default: 0 },				//踩
}, {
	versionKey: false
});

article.index({author: 1});
article.index({create_at: -1});

exports.article = mongoose.model('article', article);