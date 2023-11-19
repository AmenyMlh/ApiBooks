const mongoose = require("mongoose");
const express = require("express");
const Book = require("./models/book");
const Author = require('./models/author');
const Category = require('./models/category');
const User = require("./models/user")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
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
    const authorId = req.body.author;
    /*const existingAuthor = await Author.findById(authorId);
    console.log(authorId)

    if (!existingAuthor) {
      return res.status(404).json({ error: "Author not found" });
    }*/
    
    const savedCategories = req.body.categories

    const book = new Book({
      title: req.body.bookTitle,
      //author: existingAuthor._id,
      author: authorId,
      categories: savedCategories
    });

    const newBook = await book.save();
    res.json(newBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




// get all books
app.get("/api/books", (req, res) => {
  Book.find().populate('author').populate('categories')
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
  Book.findOne({ _id: req.params.id }).populate('author').populate('categories')
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


app.post('/api/signup', (req, res) => {
  bcrypt
  .hash(req.body.password, 10)
  .then((hash) => {
   const user = new User({
       firstName: req.body.firstName,
       lastName : req.body.lastName,
       role : req.body.role,
       email: req.body.email,
       password: hash
   })
   console.log(user.toPublic())
// console.log(user.toPublic())
   user.save()
   
   .then((response) => {
      //  const n = response.toObject()
       const newUser=response.toPublic()
       
       //delete newUser.password
       res.status(201).json({
           model: newUser,
           message: "User created",
       })
   })
   .catch((error) => res.status(400).json({error : error.message}))
  })
  .catch((error) => res.status(500).json({error : error.message}))
})


app.post('/api/login', (req, res) => {
  User.findOne({ email: req.body.email})
    .then((user) => {
        if(!user){
            return res.status(401).json({message: "Incorrect Login or Password"})
        }
        bcrypt
        .compare(req.body.password, user.password).then((valid) => {
        if (!valid){
            return res.status(401).json({message: "Incorrect Login or Password"})
        }
        res.status(200).json({
            token : jwt.sign({userId: user._id}, "RANDOM_TOKEN_SECRET",{expiresIn: "24h"}),

        })
        })
        .catch((error) => res.status(500).json({error: error.message}))
    })

})

app.get('/api/books/author/:id', async (req, res) => {
  const authorId = req.params.id;
  try {
    
    const books = await Author.findByAuthor(authorId);

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des livres par auteur.' });
  }
});




module.exports = app;
