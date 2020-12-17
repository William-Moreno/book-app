'use strict';

const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
const methodOverride = require('method-override');
let showForm = false;

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', error => console.error(error));


app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');


app.get('/', getHome);
app.get('/hello', getHello);
app.get('/searches/new', getSearch);
app.get('/books/:id', getDetails);
app.post('/search', getBooks);
app.post('/book', saveBookData);
app.put('/books/:id', updateBook);
app.get('/test/:id', testFunc);

function testFunc(req, res){
  console.log(req.params.id);
  let form = 1;
  res.render('/pages/books/' + req.params.id, {show: form});
}

function updateBook(req, res){
  const sql = `
  UPDATE book
  SET title=$2, author=$3, isbn=$4, description=$5, image_url=$6, categories=$7
  WHERE id=$1
  `;
  const sqlArray = [req.params.id, req.body.title, req.body.author, req.body.isbn, req.body.description, req.body.image_url, req.body.categories];
  client.query(sql, sqlArray)
    .then(() => {
      res.redirect('/books/' + req.params.id);
    });
}

function getHome(req, res){
  let sql='SELECT * FROM book';
  client.query(sql)
    .then(result => {
      const books = result.rows;
      res.render('pages/index.ejs', {books: books});

    });
}

function getHello(req, res){
  res.render('pages/index.ejs');
}

function getSearch(req, res){
  res.render('pages/searches/new.ejs');
}

function throwError(req, res){
  res.status(500).render('pages/error.ejs');
}

function getBooks(req, res){
  let searchString = req.body.query;
  let searchType = req.body.searchtype;
  let url=`https://www.googleapis.com/books/v1/volumes?q=${searchString}+in${searchType}:${searchString}`;
  superagent.get(url).then(returnData => {
    const bookData = (returnData.body.items);
    const bookArray = bookData.map(function(book){
      return new BookData(book);
    });
    for(let i = 0 ; i < bookArray.length ; i++){
      let regex = /http:/gi;
      bookArray[i].image_url = bookArray[i].image_url.replace(regex, 'https:');
    }
    res.render('pages/searches/show.ejs', {
      booklist: bookArray
    });
  }).catch(() => throwError);
}

function getDetails(req, res, form){
  client.query('SELECT * FROM book WHERE id=$1', [req.params.id])
    .then(result => {
      const bookdetail = result.rows[0];
      res.render('pages/books/show.ejs', {book: bookdetail, show: false});
    });
}

function saveBookData(req, res){
  const chosenBook = (req.body);
  client.query('INSERT INTO book (author, title, image_url, isbn, description, categories) VALUES($1, $2, $3, $4, $5, $6)', [chosenBook.author, chosenBook.title, chosenBook.image_url, chosenBook.isbn, chosenBook.description, chosenBook.categories]).then(() => {
    res.render('pages/books/show.ejs', {book: chosenBook});
  });
}

function BookData(book){
  this.title = book.volumeInfo.title;
  this.author = book.volumeInfo.authors && book.volumeInfo.authors[0] || 'Unlisted';
  this.description = book.volumeInfo.description || 'Not Available';
  this.image_url = book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail || `https://i.imgur.com/J5LVHEL.jpg`;
  // following code modified from code review by Nicholas Carignan
  this.isbn = 'N/A';
  const ident = book.volumeInfo.industryIdentifiers;
  if(ident) {
    for (let i = 0 ; i < ident.length ; i++) {
      this.isbn = ident[i].type + ident[i].identifier;
      if (ident[i].type === 'ISBN_13') {
        break;
      }
    }
  }
  this.categories = book.volumeInfo.categories && book.volumeInfo.categories[0];
}


// error handling and start server
app.use('*', (request, response) => {
  response.status(404).send('The route you are looking for has been disconnected. Please try another.');
});


client.connect().then(() => {
  app.listen(PORT, () => console.log(`Running on: ${PORT}`));
});
