const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Get ALL books (Promise and Callback)
function getBooks() {
    return new Promise((resolve, reject) => {
        resolve(books);
    });}
public_users.get('/',function (req, res) {
    //Write your code here
    getBooks().then((books) => res.send(JSON.stringify(books)));
});


// Search book by ISBN (Promise and Callback)
function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
        let isbnInt = parseInt(isbn);
        if (books[isbnInt]) {
            resolve(books[isbnInt]);
        } else {
            reject({status:404, message:`ISBN ${isbn} not found`});
        }});}
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    getBookByISBN(req.params.isbn)
    .then(
        booksByISBN => res.send(booksByISBN),
        error => res.status(error.status).json({message: error.message})
    );
});


// Search books by author (Promise and Callback)
public_users.get('/author/:author',function (req, res) {
    //Write your code here
    const author = req.params.author;
      getBooks()
      .then((books) => Object.values(books))
      .then((bookEntries) => bookEntries.filter((book) => book.author === author))
      .then((booksByAuthor) => res.send(booksByAuthor));
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


// Search books by title
public_users.get('/title/:title',function (req, res) {
    //Write your code here
    const title = req.params.title;
      getBooks()
      .then((books) => Object.values(books))
      .then((bookEntries) => bookEntries.filter((book) => book.title === title))
      .then((booksByTitle) => res.send(booksByTitle));
});


// Get book review
public_users.get('/review/:isbn',function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    const reviewByISBN = books[isbn].reviews
    return res.send(reviewByISBN)
});

module.exports.general = public_users;
