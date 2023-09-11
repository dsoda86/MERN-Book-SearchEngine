const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks', {
    useCreateIndex: true, // Use camelCase
    useFindAndModify: false, // Use camelCase
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
module.exports = mongoose.connection;