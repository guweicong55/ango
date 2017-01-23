var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var article = new Schema({
	title: 			{ type: String },		//标题
	content: 		{ type: String },		//内容
	article_type: 	{ type: String },		//类型
	master_name: 	{ type: String },		//作者
	create_at: 		{ type: Date, default: Date.now },		//创建时间
	push: 			{ type: Number },    	//赞同
	step: 			{ type: Number },		//踩
}, {
	versionKey: false
});

exports.article = mongoose.model('article', article);