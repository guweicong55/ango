var bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');

// 加密
exports.beHash = function (test, callback) {
	bcrypt.hash(test, 10, callback);
}

// 加密前后比较
exports.mkCompare = function (test, hash) {
	return bcrypt.compareSync(test, hash);
}

//发送邮件
exports.sendEmail = function (email, title, html) {
	var transPorter = nodemailer.createTransport({
		host: 'smtp.163.com',
		port: 465,
		secureConnection: true,
		auth: {
			user: 'guweicongv5@163.com',
			pass: 'guweicongv5'
		}
	});

	var mailOption = {
		from: 'guweicongv5@163.com',
		to: email,
		subject: title,
		html: html,
	}

	transPorter.sendMail(mailOption, function (err, info) {
		if (err) {
			console.log('邮件发送失败' + '\n' + err);
			return false;
		}
		console.log('邮件发送成功')
		return true;
	})
}
