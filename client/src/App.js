import React, { useEffect, useState } from 'react';

import Header from './Components/Header';

export const App = () => {
  const [time, setTime] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchTime() {
      const response = await fetch('/current-time');
      if (response.ok) {
        const data = await response.json();
        const date = new Date();
        date.setTime(data.time * 1000);
        date.toUTCString();
        setTime(date);
      } else {
        setError(response.statusText);
      }
    }
    fetchTime();
  }, []);

  return (
    <div className='App'>
      <Header />
      {!error ? (
        <p className='pt-2 text-center text-success'>
          {!time ? 'Loading...' : `Server time: ${time}`}
        </p>
      ) : (
        <p className='pt-2 text-center text-error'>{error}</p>
      )}
    </div>
  );
};

export default App;
