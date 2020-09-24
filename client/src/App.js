import React, { useEffect, useRef, useState } from "react";

import {
  axisBottom,
  axisLeft,
  extent,
  line,
  scaleLinear,
  scaleTime,
  select,
  max,
} from "d3";
import Header from "./Components/Header";

// const Line = () => {

// }

export const App = () => {
  const [books, setBooks] = useState([]);
  const [symbol, setSymbol] = useState(null);
  const [stockData, setStockData] = useState([]);
  const [time, setTime] = useState(null);
  const [error, setError] = useState(false);

  const svgRef = useRef();

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
          setSymbol(financeData.chart.result[0].meta.symbol)
        } else {
          setError(financeData.chart.error);
        }
      } catch (err) {
        setError(err);
      }
    }
    fetchAllData();
  }, []);

  useEffect(() => {
    console.log(stockData);
    const svgElement = select(svgRef.current);
    const x = scaleTime()
      .domain(
        extent(stockData, function (d) {
          return d.time;
        })
      )
      .range([0, 400]);
    const y = scaleLinear()
      .domain([
        0,
        max(stockData, function (d) {
          return +Math.floor(d.close);
        })+20,
      ])
      .range([400, 0]);
    const svgXSeries = svgElement
      .append("g")
      .style("font", "10px sans-serif")
      .attr("stroke", "steelblue")
      .attr("transform", "translate(-2,398)")
      .call(axisBottom(x));

    const svgYSeries = svgElement
      .append("g")
      .style("font", "10px sans-serif")
      .attr("stroke", "steelblue")
      .attr("transform", "translate(-2,-3)")
      .call(axisLeft(y));

    svgElement
      .append("path")
      .datum(stockData)
      .attr("fill", "none")
      .style("stroke", "black")
      .style("stroke-width", 2)
      .attr("d", line()
          .x((d) => x(d.time))
          .y((d) => y(Math.floor(d.close)))
      );
      svgElement.append('text').text(symbol).attr('x',175).attr('y',20)
  }, [stockData,symbol]);
  // (d,i) => d.close[i]  (d,i) => d.time[i]
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
            <div style={{ padding:'2rem',border: '3px solid lightblue'}}>
              <svg
                ref={svgRef}
                width={400}
                height={400}
                style={{
                  marginTop: "1rem",
                  backgroundColor: "aliceblue",
                  overflow: "inherit",
                }}
              ></svg>
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
