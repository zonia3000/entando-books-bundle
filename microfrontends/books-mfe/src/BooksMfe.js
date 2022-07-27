import { useContext, useState } from 'react';
import logo from './book.jpg';
import './BooksMfe.css';
import KeycloakContext from './KeycloakContext';

function BooksMfe({ config }) {
  const { systemParams, params } = config || {};
  const { api } = systemParams || {};
  const { selectedApiClaim } = params || {};

  const internalApiUrl = api && api[selectedApiClaim].url;

  const [books, setBooks] = useState(null);

  const keycloak = useContext(KeycloakContext);

  const fetchBooks = async () => {
    const options = {
      headers: {
        Authorization: `Bearer ${keycloak.token}`
      }
    };

    try {
      const internalApiResponse = await fetch(internalApiUrl + '/api/books', options);

      if (internalApiResponse.ok) {
        setBooks((await internalApiResponse.json()));
      } else {
        setBooks('Server responded with an error');
      }
    } catch (error) {
      setBooks(error.message);
    }
  };

  const addBook = async () => {

    const authorInput = document.getElementById('author')
    const titleInput = document.getElementById('title')

    if (authorInput.value && titleInput.value) {
      const options = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          author: authorInput.value,
          title: titleInput.value
        })
      };

      await fetch(internalApiUrl + '/api/book', options);

      authorInput.value = ''
      titleInput.value = ''
    }
  }

  const handleAuthenticatedClick = (func) => {
    return () => {
      if (keycloak.authenticated) {
        if (keycloak.isTokenExpired()) {
          keycloak.login();
        } else {
          func();
        }
      }
    }
  }

  const handleBooksClick = handleAuthenticatedClick(fetchBooks);
  const handleAddBookClick = handleAuthenticatedClick(addBook);

  const handleLogoutClick = () => {
    keycloak.logout();
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <button onClick={handleBooksClick}>Get Books</button>
      {books && Array.isArray(books) && (
        <>
          {books.map(function (book, idx) {
            return (<li key={idx}>{book.title} ({book.author})</li>)
          })}
        </>
      )}
      {books && !Array.isArray(books) && (
        <div>Error: {books}</div>
      )}
      <hr />
      Author:
      <input type="text" id="author" /><br />
      Title:
      <input type="text" id="title" /><br />
      <button onClick={handleAddBookClick}>Add book</button>
      <hr />
      {
        process.env.NODE_ENV === 'development' && keycloak.authenticated && (
          <button onClick={handleLogoutClick}>Log out</button>
        )
      }
    </div>
  );
}

export default BooksMfe;
