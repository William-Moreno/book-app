'use strict';

const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', error => console.error(error));



app.use(express.static('./public'));
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');


app.get('/', getHome);
app.get('/hello', getHello);
app.get('/searches/new', getSearch);
app.post('/search', getBooks);


function getHome(req, res){
  client.query('SELECT * FROM book')
    .then(result => {
      const books = result.rows;
      res.render('pages/index.ejs', {booklist: books});

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
  let url=`https://www.googleapis.com/books/v1/volumes?q=+in${searchType}:${searchString}`;
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

function BookData(book){
  this.title = book.volumeInfo.title;
  this.author = book.volumeInfo.authors || 'Unlisted';
  this.description = book.volumeInfo.description || 'Not Available';
  this.image_url = book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail || `https://i.imgur.com/J5LVHEL.jpg`;
  this.isbn = book.voulmeInfo.industryIdentifiers[0];
}


// error handling and start server
app.use('*', (request, response) => {
  response.status(404).send('The route you are looking for has been disconnected. Please try another.');
});


client.connect().then(() => {
  app.listen(PORT, () => console.log(`Running on: ${PORT}`));
});
