import React, { useEffect, useState } from "react";

import Chart from "./Components/Chart";
import Header from "./Components/Header";

export const App = () => {
  const [books, setBooks] = useState([]);
  const [symbol, setSymbol] = useState(null);
  const [stockData, setStockData] = useState([]);
  const [time, setTime] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchAllData() {
      try {
        const response = await fetch("/current-time");
        if (response.ok) {
          const data = await response.json();
          const date = new Date();
          date.setTime(data.time * 1000);
          date.toUTCString();
          setTime(date);
        } else {
          setError(response.statusText);
        }
        const booksResRaw = await fetch("/api/books");
        const booksData = await booksResRaw.json();
        setBooks(booksData);
        const financeDataRaw = await fetch("/finance-data");
        const financeData = await financeDataRaw.json();
        if (!financeData.chart.error) {
          setStockData(
            financeData.chart.result[0].indicators.adjclose[0].adjclose.map(
              (close, i) => {
                return {
                  close: close,
                  time: financeData.chart.result[0].timestamp[i] * 1000,
                };
              }
            )
          );
          setSymbol(financeData.chart.result[0].meta.symbol);
        } else {
          setError(financeData.chart.error);
        }
      } catch (err) {
        setError(err);
      }
    }
    fetchAllData();
  }, []);

  return (
    <div className="App">
      <Header />
      {!error ? (
        <div>
          <p className="pt-2 text-center text-success">
            {!time ? "Loading..." : `Server time: ${time}`}
          </p>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <ul>
              {books.map((book, i) => (
                <li key={i}>
                  {book.title} - {book.author}
                </li>
              ))}
            </ul>
            <div style={{ padding: "2rem", border: "3px solid lightblue" }}>
              <Chart symbol={symbol} data={stockData}></Chart>
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
