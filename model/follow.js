var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var article = require('./article').article;

var follow = new Schema({
	create_by: String,
	create_at: { type: Number, default: Date.now },
	article_id: String,
	post: { type: Schema.Types.ObjectId, ref: 'article' }
}, {
	versionKey: false
});

follow.index({create_at: -1});
follow.index({article_id: 1});
follow.index({create_by: 1});

exports.follow = mongoose.model('follow', follow);