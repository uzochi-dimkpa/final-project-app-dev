const mongoose = require('mongoose');


let url = `mongodb+srv://dbUser:password123!@cluster0.83ninbj.mongodb.net/?retryWrites=true&w=majority`;


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
    console.error(`Error: ${error.message}`)
  }
}


module.exports = { connectToDBs };