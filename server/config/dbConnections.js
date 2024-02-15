const mongoose = require('mongoose');
require('dotenv').config({ db_url: `.env.${process.env.MONGO_DB_REMOTE_URL}` });


let url = process.env.MONGO_DB_REMOTE_URL;

const connectToDBs = () => {

  try {
    const pbDB = mongoose.createConnection(url, {
      dbName: 'personal-budget',
      ssl: true,
      // useUnifiedTopology: true,
      // useNewUrlParser: true,
      maxPoolSize: 10
    })
    const guestDB = mongoose.createConnection(url, {
      dbName: 'guest-budget',
      ssl: true,
      // useUnifiedTopology: true,
      // useNewUrlParser: true,
      maxPoolSize: 10
    })

    return { pbDB, guestDB }
  } catch (error) {
    // console.error(`Error: ${error.message}`)
  }
}


module.exports = { connectToDBs };