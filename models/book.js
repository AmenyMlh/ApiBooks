const mongoose = require('mongoose');
//const idValidator = require('mongoose-id-validator')

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
bookSchema.statics.findByAuthor = function (authorId, cb) {
  return this.find({ author: authorId }, cb);
};
//bookSchema.plugin(idValidator);

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;





