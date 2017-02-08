var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var praise = new Schema({
	author: String,
	article_id: String,
	is_good: Number
}, {
	versionKey: false
});

exports.praise = mongoose.model('praise', praise);