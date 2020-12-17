'use strict';

const button = document.getElementById('show-form');
const form = document.getElementById('update-form');
const box = document.getElementById('btn-box');
const book = document.getElementById('book-selector');
const select = document.getElementById('select-book');

button.addEventListener('click', () =>{
  form.style.display = 'block';
  box.style.display = 'none';
});

select.addEventListener('click', () =>{
  book.style.display = 'block';
  
});