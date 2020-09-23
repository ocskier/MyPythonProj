import React, { useEffect, useState } from 'react';

import Header from './Components/Header';

export const App = () => {
  const [books, setBooks] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [time, setTime] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchAllData() {
      try {
        const response = await fetch('/current-time');
        if (response.ok) {
          const data = await response.json();
          const date = new Date();
          date.setTime(data.time * 1000);
          date.toUTCString();
          setTime(date);
        }
        else {
          setError(response.statusText);
        }
        const booksResRaw = await fetch('/api/books')
        const booksData = await booksResRaw.json();
        setBooks(booksData);
        const financeDataRaw = await fetch('/finance-data');
        const financeData = await financeDataRaw.json();
        if(!financeData.chart.error){
          setStockData(financeData.chart.result);
        } 
        else {
          setError(financeData.chart.error)
        }
      } catch(err){
        setError(err);
      }
    }
    fetchAllData();
  }, []);

  useEffect(()=>console.log(stockData),[stockData])

  return (
    <div className="App">
      <Header />
      {!error ? (
        <div>
          <p className="pt-2 text-center text-success">
            {!time ? "Loading..." : `Server time: ${time}`}
          </p>
          <div style={{display:'flex',justifyContent: 'space-around'}}>
          <ul>
            {books.map((book,i) => (
              <li key={i}>
                {book.title} - {book.author}
              </li>
            ))}
          </ul>
          <div>
            <p>Chart gonna go here</p>
            <p style={{textAlign: 'center'}}>{stockData[0]?.meta.symbol}</p>
          </div>
          </div>
        </div>
      ) : (
        <p className="pt-2 text-center text-error">{error}</p>
      )}
    </div>
  );
};

export default App;
