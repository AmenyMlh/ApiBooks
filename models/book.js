const mongoose = require('mongoose');
const {Schema} = mongoose;
const bookSchema = new mongoose.Schema({
  title: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Author',
    required: true
  },
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }]
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;





