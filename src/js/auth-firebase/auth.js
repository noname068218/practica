import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { getDatabase, set, ref, get, child, onValue } from 'firebase/database';
import Notiflix from 'notiflix';
const firebaseConfig = {
  apiKey: 'AIzaSyAX0JTfXMuIFxfZ0Uw7U9gdUFZAWUTy4OE',
  authDomain: 'book-js-27f59.firebaseapp.com',
  databaseURL:
    'https://book-js-27f59-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'book-js-27f59',
  storageBucket: 'book-js-27f59.appspot.com',
  messagingSenderId: '710554372563',
  appId: '1:710554372563:web:18f70250290b9da4d4c726',
};
function closeAuthModal() {
  divFormBox.style.display = 'none'; // Приховати модальне вікно
}
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

//inputs
const emailEl = document.querySelector('.email-js');
const passwordEl = document.querySelector('.password-js');
const nameEl = document.querySelector('.name-js');
//inputs

//Buttons form
const mainSignUp = document.querySelector('.js-submit-up');
const mainSignIn = document.querySelector('.js-submit-in');

const btnSignIn = document.querySelector('.js-in');
const btnSignUp = document.querySelector('.js-up');
const modalClose = document.querySelector('.registration-close-btn');
//Buttons form

//Buttons open and close and username
const btnOpen = document.querySelector('.sign-up-btn');
const btnLogOut = document.querySelector('.sign-out-btn');
const btnUserName = document.querySelector('.user-btn');
const authContent = document.querySelector('.content-auth');
//Buttons open and close and username

//form
const divFormBox = document.querySelector('.form-box');
const formEl = document.querySelector('.form');
//form
const isLoggedIn = { logged: null };

formEl.addEventListener('submit', event => {
  event.preventDefault();
  event.currentTarget.reset();
});

const userSingUp = async () => {
  const singUpEmail = emailEl.value;
  const singUppassword = passwordEl.value;
  const singUpName = nameEl.value;
  await createUserWithEmailAndPassword(auth, singUpEmail, singUppassword)
    .then(userCredential => {
      const user = userCredential.user;
      set(ref(database, 'users/' + user.uid), {
        username: singUpName,
      });
      closeAuthModal();
      btnLogOut.classList.remove('visually-hidden');
      btnSignUp.classList.add('visually-hidden');

      Notiflix.Notify.success('Успіх');
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        Notiflix.Notify.failure(`Email address ${singUpEmail} already in use.`);
      } else {
        console.error('Помилка реєстрації:', error);
      }
    });
};

const userSingIn = async () => {
  const singInEmail = emailEl.value;
  const singInPassword = passwordEl.value;
  await signInWithEmailAndPassword(auth, singInEmail, singInPassword)
    .then(userCredential => {
      const user = userCredential.user;
      console.log('Користувач авторизований:', user);

      // Отримайте дані користувача і відобразіть їх на сторінці
      // Наприклад, відобразіть ім'я користувача на сторінці

      get(ref(database, 'users/' + user.uid)).then(snapshot => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          const username = userData.username;
          // Отримали ім'я користувача, тепер відобразіть його на сторінці
          displayUsername(username);
        }
      });
    })
    .catch(error => {
      if (error.code === 'auth/user-not-found') {
        console.log(
          'Користувача з такою адресою електронної пошти не знайдено'
        );
      } else {
        console.error('Помилка авторизації:', error);
      }
    });
};

const checkAuthState = async () => {
  onAuthStateChanged(auth, user => {
    if (user) {
      isLoggedIn.logged = true;
    } else {
      isLoggedIn.logged = false;
    }
  });
};

async function userSignOut() {
  await signOut(auth);
  window.location.reload();
}

function displayUsername(username) {
  btnUserName.querySelector('.userName').textContent = username;
  btnUserName.classList.remove('visually-hidden');
  btnLogOut.classList.remove('visually-hidden');
  btnSignUp.classList.add('visually-hidden');
}

mainSignUp.addEventListener('click', userSingUp);
mainSignIn.addEventListener('click', userSingIn);
btnLogOut.addEventListener('click', userSignOut);

checkAuthState();
