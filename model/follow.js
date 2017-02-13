var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var follow = new Schema({
	create_by: String,
	create_at: { type: Number, default: Date.now },
	article_id: String
}, {
	versionKey: false
});

exports.follow = mongoose.model('follow', follow);