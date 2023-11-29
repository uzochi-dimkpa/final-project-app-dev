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
	},
	monthly_income: {
		type: Number,
		required: false,
		unique: false
	},
	monthly_expense: {
		type: Number,
		required: false,
		unique: false
	}
}, {collection: 'users'});


module.exports = mongoose.model('users', pbUserSchema);
