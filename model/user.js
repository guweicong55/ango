var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var moment = require('moment');

var user = new Schema({
	user_name : 		{ type: String }, 					//账号
	nick_name : 		{ type: String }, 					//昵称
	sex :				{ type: String }, 					//性别
	email : 			{ type: String }, 					//邮箱
	password : 			{ type: String },					//密码
	phone: 				{ type: String },					//手机号
	last_login_ip: 		{ type: String },					//最后登录IP
	last_login_time:	{ type: Number },					//最后登录时间
	reg_ip: 			{ type: String },					//注册IP
	creat_at:　			{ type: Number, default: Date.now } //创建时间
}, {
	versionKey: false
});

user.index({ user_name: 1 }, { unique: true });
user.index({ email: 1 }, { unique: true });

exports.user = mongoose.model('user', user);