import React, { useEffect, useState } from 'react';

import Header from './Components/Header';

export const App = () => {
  const [books, setBooks] = useState([]);
  const [time, setTime] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchTimeAndBooks() {
      const response = await fetch('/current-time');
      if (response.ok) {
        const data = await response.json();
        const date = new Date();
        date.setTime(data.time * 1000);
        date.toUTCString();
        setTime(date);
        const booksResRaw = await fetch('/api/books')
        const booksData = await booksResRaw.json();
        setBooks(booksData);
      } else {
        setError(response.statusText);
      }
    }
    fetchTimeAndBooks();
  }, []);

  return (
    <div className="App">
      <Header />
      {!error ? (
        <div>
          <p className="pt-2 text-center text-success">
            {!time ? "Loading..." : `Server time: ${time}`}
          </p>
          <ul>
            {books.map((book,i) => (
              <li key={i}>
                {book.title} - {book.author}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="pt-2 text-center text-error">{error}</p>
      )}
    </div>
  );
};

export default App;
