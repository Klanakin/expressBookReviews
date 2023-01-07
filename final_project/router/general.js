const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Get the book list available in the shop (Promise and Callback)
function getBooks() {
    return new Promise((resolve, reject) => {
        resolve(books);
    });}
public_users.get('/',function (req, res) {
    //Write your code here
    getBooks().then((books) => res.send(JSON.stringify(books)));
});


// Get book details based on ISBN (Promise and Callback)
function getByISBN(isbn) {
    return new Promise((resolve, reject) => {
        let isbnNumber = parseInt(isbn);
        if (books[isbnNumber]) {
            resolve(books[isbnNumber]);
        } else {
            reject({status:404, message:`ISBN ${isbn} not found`});
        }});}
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    getByISBN(req.params.isbn)
    .then(
        result => res.send(result),
        error => res.status(error.status).json({message: error.message})
    );
});


// Register a new user
public_users.post("/register", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Write your code here
    const author = req.params.author;
    const bookEntries = Object.entries(books);
    const booksByAuthor = bookEntries.filter(([key, value]) => value.author === author);
    return res.send(booksByAuthor);
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here
    const title = req.params.title;
    const bookEntries = Object.entries(books);
    const booksByTitle = bookEntries.filter(([key, value]) => value.title === title);
    return res.send(booksByTitle);
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    const reviewByISBN = books[isbn].reviews
    return res.send(reviewByISBN)
});

module.exports.general = public_users;
