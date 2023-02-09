const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      console.log(users);
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   res.send(JSON.stringify(books,null,5))
// });
public_users.get('/', (req, res) => {
  return new Promise((resolve, reject) => {
    resolve(JSON.stringify(books, null, 5));
  })
  .then(result => {
    res.send(result);
  })
  .catch(err => {
    console.error(err);
    res.status(500).send('An error occurred');
  });
});



// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   isbn = req.params.isbn
//   res.send(books[isbn]);
//  });

 public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  return new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject(new Error(`No book found with ISBN: ${isbn}`));
    }
  })
  .then((book) => {
    res.send(book);
  })
  .catch((error) => {
    res.status(404).send(error.message);
  });
});
  
// Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//   const author = req.params.author
//   let found = false;
//   for (let i = 1; i <= Object.keys(books).length; i++) {
//     if (books[i].author === author) {
//       found = true;
//       res.send(books[i]);
//       break;
//     }
//   }
//   if (!found) {
//     return res.status(404).json({message: "Author not found"});
//   }
// });

public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const bookArray = Object.values(books);
  
  Promise.resolve(bookArray)
  .then(function (bookArray) {
  return bookArray.find(function (book) {
  return book.author === author;
  });
  })
  .then(function (foundBook) {
  if (!foundBook) {
  return res.status(404).json({message: "Author not found"});
  }
  res.send(foundBook);
  });
  });

public_users.get('/title/:title', function(req,res){
  const title = req.params.title;
  const bookArray = Object.values(books);
  Promise.resolve(bookArray)
  .then(function (bookArray){
    return bookArray.find(function (book){
      return book.title === title;
    })
  })
  .then(function (foundBook) {
    if (!foundBook){
      return res.status(404).json({message: "Author not found"});
    }
    res.send(foundBook)
  })
})


// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   const title = req.params.title
//   let found = false;
//   for (let i = 1; i <= Object.keys(books).length; i++) {
//     if (books[i].title === title) {
//       found = true;
//       res.send(books[i]);
//       break;
//     } 
//   }
//   if (!found) {
//     return res.status(404).json({message: "Author not found"});
//   }
// });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
 const isbn = req.params.isbn;
 return res.send(books[isbn].reviews)

}); 

module.exports.general = public_users;
