const mongoose = require('mongoose');
const { connectToDBs } = require('../config/dbConnections');


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
		required: true,
		unique: false,
		length: 7,
		lowercase: true
	}
}, {collection: 'budgets'});


pbBudgetSchema.index({username: 1, category: 1}, {unique: true});


const { pbDB } = connectToDBs();


module.exports = {
  pbUserModel: pbDB.model('users', pbUserSchema),
  pbBudgetModel: pbDB.model('budgets', pbBudgetSchema)
};
