const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  lastName: String,
  firstName: String,
  nationality: String
});

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;