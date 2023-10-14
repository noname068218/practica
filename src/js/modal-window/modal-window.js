import { fetchBookById } from '../books-api/books-api';
const booksContainer = document.querySelector('.books-container');

// Вибір елементів DOM для модального вікна
const modalWindow = document.querySelector('.backdrop');
const modalCloseButton = document.querySelector('.modal-close');
const bookWrapper = document.querySelector('.book-data');
let shopingList = [];
const savedShoppingList = localStorage.getItem('booksShopingList');

// Проверяем есть ли в localStorage массив с книгами, если есть присваиваем его значение массиву shopingList
if (savedShoppingList) {
  shopingList = JSON.parse(savedShoppingList);
  console.log(shopingList);
}

booksContainer.addEventListener('click', onBookClick);

// Функція для відкриття модального вікна з інформацією про книгу
function openModal() {
  modalWindow.style.display = 'block';

  // Додаємо обробник події для кнопки закриття модального вікна
  modalCloseButton.addEventListener('click', closeModal);
}

// Функція для закриття модального вікна
function closeModal() {
  modalWindow.style.display = 'none'; // Сховуємо модальне вікно

  // Видаляємо обробник події для кнопки закриття модального вікна
  modalCloseButton.removeEventListener('click', closeModal);
}

// Функція для обробки кліку на книгу
function onBookClick(e) {
  e.preventDefault();
  const bookLink = e.target.closest('.book_link');
  fetchBookById(bookLink.id).then(bookData => {
    bookRender(bookData);
  });

  openModal();
}

function bookRender({
  title,
  author,
  book_image,
  description,
  buy_links,
  list_name,
}) {
  const markup = `<img class="book-img" src="${book_image}" alt="${title}" />
      <h2 class="title">${title}</h2>
      <p class="author">${author}</p>
      <p class="description" data-category="${list_name}">${description}</p>
      <div class="link-wraper">
        <a class="book-link link amazon-by-link" href="${buy_links[0].url}">свг</a>
        <a class="book-link link apple-books-by-link" href="${buy_links[1].url}">свг</a>
      </div>
      <button type="button" class="book-button">add to shopping list</button>
      <button type="button" class="remove-button visually-hidden">remove from the shopping list</button>
      <p class="congrats-text visually-hidden">Congratulations! You have added the book to the shopping list. To delete, press the button “Remove from the shopping list”.</p>`;

  bookWrapper.innerHTML = markup;

  const bookButton = document.querySelector('.book-button');
  const removeButton = document.querySelector('.remove-button');
  const congratsTextEl = document.querySelector('.congrats-text');
  const bookImgEl = document.querySelector('.book-img'); //+
  const bookTitleEl = document.querySelector('.title');
  const bookAuthorEl = document.querySelector('.author');
  const bookDescriptionEl = document.querySelector('.description'); //+
  const amazonLinkEl = document.querySelector('.amazon-by-link');
  const appleLinkEl = document.querySelector('.apple-books-by-link');

  // Проверяем, если книга уже добавлена в список покупок
  if (isBookInShoppingList(title)) {
    bookButton.classList.add('visually-hidden');
    removeButton.classList.remove('visually-hidden');
  }

  bookButton.addEventListener('click', setShopingListToLocalStorage);
  removeButton.addEventListener('click', removeFromShoppingList);

  function setShopingListToLocalStorage() {
    const bookData = {
      img: bookImgEl.src,
      category: bookDescriptionEl.dataset.category,
      title: bookTitleEl.textContent,
      author: bookAuthorEl.textContent,
      amazon: amazonLinkEl.href,
      apple: appleLinkEl.href,
    };
    shopingList.push(bookData);
    setLocalStorage('booksShopingList', shopingList);

    bookButton.classList.toggle('visually-hidden');
    removeButton.classList.toggle('visually-hidden');
    congratsTextEl.classList.toggle('visually-hidden');
  }

  function removeFromShoppingList() {
    const bookTitle = bookTitleEl.textContent;
    // Находим индекс книги в массиве shopingList
    const index = shopingList.findIndex(item => item.title === bookTitle);
    if (index !== -1) {
      shopingList.splice(index, 1); // Удаляем книгу из массива
      setLocalStorage('booksShopingList', shopingList);
    }

    // Показываем кнопку "add to shopping list" и скрываем "remove from the shopping list"
    bookButton.classList.remove('visually-hidden');
    removeButton.classList.add('visually-hidden');
  }
}

// Функция для проверки, добавлена ли книга в список покупок
function setLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error.message);
  }
}

function removeBook() {
  const bookTitleEl = document.querySelector('.title');
  const currentTitle = bookTitleEl.textContent;
  const books = localStorage.getItem('booksShopingList');
  const parsedBooks = JSON.parse(books);
  const indexOfBook = parsedBooks.findIndex(
    book => book.title === currentTitle
  );

  const updateBooks = parsedBooks.splice(indexOfBook, 1);
  setLocalStorage('booksShopingList', JSON.stringify(updateBooks));
}

function isBookInShoppingList(title) {
  return shopingList.some(book => book.title === title);
}
