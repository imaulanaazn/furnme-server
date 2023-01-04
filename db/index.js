const mongoose = require('mongoose')
const { urlDb } = require('../config')

mongoose.set('strictQuery', true);
mongoose.connect(urlDb, {
  useUnifiedTopology: true,
  useNewUrlParser: true 
})

const db =  mongoose.connection

module.exports = db