const mongoose = require("mongoose");
const express = require("express");
const Book = require("./models/book");
const Author = require('./models/author');
const Category = require('./models/category');
const app = express();

app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/books")
  .then(() => console.log("Connexion a MongoDb réussie !!"))
  .catch(() => console.log("Connexion a MongoDB échouée !!!!!!"));

//add a book
/*app.post("/api/books", (req, res) => {
  let newBook = new Book({
    title: req.body.title,
    ISBN: req.body.ISBN,
    author: req.body.author,
    price: req.body.price,
  });

  newBook
    .save(newBook)
    .then(() =>
      res.status(201).json({
        model: newBook,
        message: "Book Added !",
      })
    )
    .catch((error) =>
      res.status(400).json({
        error: error.message,
        message: "Invalid data !!!",
      })
    );
});*/

app.post("/api/author", (req, res) => {
  let newAuthor = new Author({
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    nationality: req.body.nationality,
  });

  newAuthor
    .save(newAuthor)
    .then(() =>
      res.status(201).json({
        model: newAuthor,
        message: "Author Added !",
      })
    )
    .catch((error) =>
      res.status(400).json({
        error: error.message,
        message: "Invalid data !!!",
      })
    );
});

app.post("/api/category", (req, res) => {
  let newCategory = new Category({
    title: req.body.title,
    
  });

  newCategory
    .save(newCategory)
    .then(() =>
      res.status(201).json({
        model: newCategory,
        message: "Category Added !",
      })
    )
    .catch((error) =>
      res.status(400).json({
        error: error.message,
        message: "Invalid data !!!",
      })
    );
});




app.post('/api/books', async (req, res) => {
  try {
    const author = new Author({
      lastName: req.body.authorLastName,
      firstName: req.body.authorFirstName,
      nationality: req.body.authorNationality
    });
    const newAuthor = await author.save();

    const categories = req.body.categories.map(categoryTitle => new Category({ title: categoryTitle }));
    const savedCategories = await Category.insertMany(categories);

    const book = new Book({
      title: req.body.bookTitle,
      author: newAuthor._id,
      categories: savedCategories.map(category => category._id)
    });

    const newBook = await book.save();
    res.json(newBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




// get all books
app.get("/api/books", (req, res) => {
  Book.find().populate('Author')
    .then((books) =>
      res.status(200).json({
        model: books,
        message: "Success",
      })
    )
    .catch((error) =>
      res.status(400).json({
        error: error.message,
        message: "Problem !!",
      })
    );
});

// get a book by id
app.get("/api/books/:id", (req, res) => {
  Book.findOne({ _id: req.params.id }).populate('Author')
    .then((book) => {
      if (!book) {
        res.status(404).json({
          message: "Book not found !!",
        });
        return;
      }
      res.status(200).json({
        model: book,
        message: "Book Found",
      });
    })
    .catch((error) =>
      res.status(400).json({
        error: error.message,
        message: "Book doesn't exist !!!",
      })
    );
});

// update an existing book
app.patch("/api/books/:id", (req, res) => {
  Book.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }).then(
    (book) => {
      if (!book) {
        res.status(404).json({
          message: "Book Found !!",
        });
        return;
      }
      res.status(200).json({
        model: book,
        message: "Book updated with success",
      });
    }
  );
});

// delete a book
app.delete("/api/books/:id", (req, res) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Book deleted with success" }))
    .catch((error) =>
      res.status(400).json({
        error: error.message,
        message: "Book doesn't exist !!!",
      })
    );
});

module.exports = app;
