const mongoose = require('mongoose');


const pbUserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
		unique: true
	}
}, {collection: 'users'});


module.exports = mongoose.model('users', pbUserSchema);
