const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    enum: ['Horror', 'Mystery', /* Autres catégories ici */],
    required: true
  }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;