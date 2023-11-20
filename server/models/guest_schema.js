const mongoose = require('mongoose');
const { connectToDBs } = require('../config/dbConnections');


const guestSchema = new mongoose.Schema({
	category: {
		type: String,
		required: true,
		unique: true,
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


const { guestDB } = connectToDBs();


module.exports = {
  guestModel: guestDB.model('budgets', guestSchema)
};
