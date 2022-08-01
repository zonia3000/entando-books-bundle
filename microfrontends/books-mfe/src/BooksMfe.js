import { useContext, useState, useEffect } from 'react';
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

  // Loads the books at component startup
  useEffect(() => {
    async function fetchData() {
      if (keycloak.token) {
        await fetchBooks();
      }
    }
    fetchData();
  }, [keycloak]);

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

      const response = await fetch(internalApiUrl + '/api/book', options);
      const newBook = await response.json();
      setBooks([...books, newBook]);

      authorInput.value = '';
      titleInput.value = '';
    }
  }

  const deleteBook = async (id) => {
    try {
      const options = {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      };

      await fetch(internalApiUrl + '/api/book/' + id, options);

      setBooks(books.filter(b => b.id !== id))
    } catch (error) {
      setBooks(error.message);
    }
  }

  const handleAuthenticatedClick = (func) => {
    return (param) => {
      if (keycloak.authenticated) {
        if (keycloak.isTokenExpired()) {
          keycloak.login();
        } else {
          func(param);
        }
      }
    }
  }

  const handleBooksClick = handleAuthenticatedClick(fetchBooks);
  const handleAddBookClick = handleAuthenticatedClick(addBook);
  const handleDeleteBookClick = handleAuthenticatedClick(deleteBook);

  const handleLogoutClick = () => {
    keycloak.logout();
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <p>Used API claims: <strong>{selectedApiClaim}</strong></p>
      <h3>List of books</h3>
      {books && Array.isArray(books) && (
        <ul className="list-group">
          {books.map(function (book, idx) {
            return (<li className="list-group-item" key={idx}>{book.title} ({book.author}) <span onClick={() => handleDeleteBookClick(book.id)} className="delete">&times;</span></li>)
          })}
        </ul>
      )}
      {books && Array.isArray(books) && books.length === 0 && (<p>Empty list</p>)}
      {books && !Array.isArray(books) && (
        <div>Error: {books}</div>
      )}
      <button onClick={handleBooksClick} className="btn btn-primary mt-3">Reload books</button>
      <hr />
      <h3>Insert a new book</h3>
      <div className="form-group">
        <div className="row">
          <label className="control-label col-sm-2" for="author">Author</label>
          <div className="col-sm-9">
            <input type="text" id="author" name="author" className="form-control" />
          </div>
        </div>
        <div className="row">
          <label className="control-label col-sm-2" for="title">Title</label>
          <div className="col-sm-9">
            <input type="title" id="title" name="title" className="form-control" />
          </div>
        </div>
      </div>
      <button onClick={handleAddBookClick} className="btn btn-primary mt-3">Add book</button>
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
