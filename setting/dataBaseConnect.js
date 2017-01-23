var mongoose = require('mongoose');

module.exports = function (argument) {
	var db = mongoose.connect('mongodb://localhost/ango');
	db.connection.on('error', function (err) {
		console.log('dataBase connection failed' + err);
	});
	db.connection.on('open', function () {
		console.log('dataBase connection success');
	});
}