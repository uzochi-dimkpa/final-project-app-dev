const mongoose = require('mongoose');


const pbBudgetSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: false
	},
	category: {
		type: String,
		required: true,
		unique: false,
		trim: true
	},
	amount: {
		type: Number,
		required: true,
		unique: false
	},
	color: {
		type: String,
		length: 7,
		lowercase: true
	}
}, {collection: 'budgets'});


module.exports = mongoose.model('budgets', pbBudgetSchema);
