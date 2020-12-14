'use strict';

const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;





app.use(express.static('./public'));

app.set('view engine', 'ejs');

app.get('/', getHome);



function getHome(req, res){
  res.render('pages/index.ejs');
}



// error handling and start server
app.use('*', (request, response) => {
  response.status(404).send('The route you are looking for has been disconnected. Please try another.');
});
app.listen(PORT, () => console.log(`Running on ${PORT}`));
