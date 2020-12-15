'use strict';

const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;





app.use(express.static('./public'));
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');


app.get('/', getHome);
app.get('/hello', getHello);
app.get('/searches/new', getSearch);
app.get('/search', getBooks);



function getHome(req, res){
  res.render('pages/index.ejs');
}

function getHello(req, res){
  res.render('pages/index.ejs');
}

function getSearch(req, res){
  res.render('pages/searches/new.ejs');
}

function getBooks(req, res){
  console.log(req.query);
  let searchString = req.query.query;
  let searchType = req.query.searchtype;
  
  let url=`https://www.googleapis.com/books/v1/volumes?q=${searchString}`;
  superagent.get(url).then(returnData => {
    const bookData = (returnData.body.items);
    const bookInstance = bookData.map(function(book){
      return new BookData(book);
  });
});
}

function BookData(book){
  this.title = book.volumeInfo.title;
  this.author = book.volumeInfo.author;
  this.description = book.volumeInfo.description;
  this.image_url = book.volumeInfo.imageLinks.thumbnail || `https://i.imgur.com/J5LVHEL.jpg`;
}

// error handling and start server
app.use('*', (request, response) => {
  response.status(404).send('The route you are looking for has been disconnected. Please try another.');
});

app.listen(PORT, () => console.log(`Running on: ${PORT}`));
