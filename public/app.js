'use strict';

const button = document.getElementById('show-form');
const form = document.getElementById('update-form');
const box = document.getElementById('btn-box');

button.addEventListener('click', () =>{
  form.style.display = 'block';
  box.style.display = 'none';
});

