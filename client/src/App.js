import React, { useEffect, useRef, useState } from 'react';

import {select} from 'd3';
import Header from './Components/Header';

// const Line = () => {

// }

export const App = () => {
  const [books, setBooks] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [time, setTime] = useState(null);
  const [error, setError] = useState(false);

  const svgRef = useRef();

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

  useEffect(()=>{
    console.log(stockData)
    const svgElement = select(svgRef.current);
    console.log(svgElement)
    svgElement.append('line').attr('cx',100).attr('cy',100);
  },[stockData])

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
            <svg ref={svgRef} style={{border:"solid 2px blue",marginTop: '1rem'}}></svg>
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
