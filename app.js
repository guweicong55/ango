/*
 *	ango -- app.js
 *  这是一个前后端分离的项目，不需要后端的渲染引擎
 *  前端框架为angular, jQuery
 *  数据库使用mongodb
 *  前端部分放置于static文件夹
 *  
 */

var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);

var config = require('./setting/config');
var url = require('./url/baseUrl');
var dbConnect = require('./setting/dataBaseConnect');

var app = express();

app.use(logger());
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.static('./static'));

//链接数据库
dbConnect();

//设置session中间件
app.use(cookieParser(''));
app.use(session({
	secret: 'sessiontest',
	cookie: { maxAge: 1000*60*60 }, //过期时间为60m
	resave: false,
	saveUninitialized:true,

	//将session储存在数据库
	store: new mongoStore({
        mongooseConnection: mongoose.connection //使用已有的数据库连接
    })
}));

//将url交给统一的url管理器
app.use('/', url);

app.use(function (err, req, res, next) {
	console.error(err);
	return res.status(500).send('500 status');
});

app.use(function (err, req, res, next) {
	console.error(err);
	return res.status(404).send('404 status');
});

app.listen(config.PORT, function () {
	console.log('server is running on' + ' ' + config.PORT + '\n' + new Date());
});


