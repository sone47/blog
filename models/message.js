var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
	content: String,
	name: String,
	email: String,
	createTime: Date
});

module.exports = mongoose.model('Message', messageSchema);