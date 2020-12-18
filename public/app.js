'use strict';

const button = document.getElementById('show-form');
const form = document.getElementById('update-form');
const box = document.getElementById('btn-box');
const book = document.getElementById('book-selector');
const select = document.getElementById('select-book');
const navOpen = document.getElementById('nav-open');
const navClose = document.getElementById('nav-close');
const navbar = document.getElementById('drop-down');


button.addEventListener('click', () => {
  form.style.display = 'block';
  box.style.display = 'none';
});

select.addEventListener('click', () => {
  book.style.display = 'block';
});

navOpen.addEventListener('click', (e) => {
  navbar.className = navbar.className? 'retracted' : '';
  e.preventDefault();
});

navClose.addEventListener('click', (e) => {
  navbar.className = navbar.className? '' : 'retracted';
  e.preventDefault();
});
