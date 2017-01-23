var express = require('express');
var router = express.Router();

/*
 *  这是一个统一的url管理器
 *  controller函数从外部导入放入相应url的回调函数
 *  如router.get(your url, fn(req, res){})
 *  导入你需要的回调函数文件(ps：一般放在controller文件夹)
 */

var sign = require('../controller/sign');

// 注册登录退出
router.post('/signup', sign.signUp);
router.post('/signin', sign.signIn);
router.get('/quite', sign.quite);

//发布文章
router.post('/publish', sign.publish);

// 导出router,由入口文件app.js执行
module.exports = router;