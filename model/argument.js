var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var argument = new Schema({
	author: String,
	create_at: { type: Number, default: Date.now },
	content: String,
	article_id: String
}, {
	versionKey: false
});

exports.argument = mongoose.model('argument', argument);