var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = require('./user').user;

var onfocus = new Schema({
	creat_at: { type: Number, default:Date.now },
	from: String,
	to: String,
	from_id: { type: Schema.Types.ObjectId, ref: 'user' },
	to_id: { type: Schema.Types.ObjectId, ref: 'user' }
}, {
	versionKey: false
});

onfocus.index({ from: 1 });
onfocus.index({ to: 1 });

exports.onfocus = mongoose.model('onfocus', onfocus);