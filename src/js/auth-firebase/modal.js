const btnOpen = document.querySelector('.sign-up-btn');
const btnLogOut = document.querySelector('.sign-out-btn');
const modalClose = document.querySelector('.registration-close-btn');
const formEl = document.querySelector('.form-box');
const body = document.querySelector('body');
const btnSignIn = document.querySelector('.js-in');
const btnSignUp = document.querySelector('.js-up');
const mainSignUp = document.querySelector('.js-submit-up');
const mainSignIn = document.querySelector('.js-submit-in');
const nameInpEl = document.querySelector('.name-js');

btnOpen.addEventListener('click', () => {
  formEl.style.display = 'block';
});

modalClose.addEventListener('click', e => {
  e.preventDefault(); // Зупинити дію форми (у цьому випадку, оновлення сторінки)
  formEl.style.display = 'none';
});

btnSignIn.addEventListener('click', () => {
  nameInpEl.style.display = 'none';
  mainSignIn.classList.remove('visually-hidden');
  mainSignUp.classList.add('visually-hidden');
});
btnSignUp.addEventListener('click', () => {
  nameInpEl.style.display = 'block';
  mainSignIn.classList.add('visually-hidden');
  mainSignUp.classList.remove('visually-hidden');
});
