import React, { useEffect, useState } from "react";

import { Button, TextField, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";

import Chart from "./Components/Chart";
import Header from "./Components/Header";

import './App.css';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
      },
      display: "inline-flex",
      width: 400,
    },
    hide: {
      visibility: "hidden",
    },
    show: {
      visibility: "visible",
    }
  })
);

export const App = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [symbol, setSymbol] = useState(null);
  const [stockData, setStockData] = useState([]);
  const [time, setTime] = useState(null);
  const [error, setError] = useState(false);

  const classes = useStyles();

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
      } catch (err) {
        setError(err);
      }
    }
    fetchAllData();
  }, []);

  const getStockData = async (e) => {
    e.preventDefault();
    const financeDataRaw = await fetch(`/finance-data/${search}`);
    const financeData = await financeDataRaw.json();
    console.log(financeData);
    if (!financeData.error) {
      setStockData(
        financeData.stockData
      );
      setSymbol(financeData.symbol);
      setSearch('');
    } else {
      setError(financeData.error);
    }
  };

  return (
    <div className="App">
      <Header />
      {!error ? (
        <div className='main'>
          <p className="pt-2 text-center text-success">
            {!time ? "Loading..." : `Server time: ${time}`}
          </p>
          <div style={{ display: "flex", justifyContent: "space-around", flexWrap: 'wrap' }}>
            <div>
              <form onSubmit={getStockData} className={classes.root} noValidate autoComplete="off">
                <Typography align="right" style={{ margin: "auto 8px" }}>
                  Stock
                </Typography>
                <TextField
                  id="outlined-basic"
                  label="Symbol"
                  onChange={(e) => setSearch(e.target.value)}
                  variant="outlined"
                  value={search}
                />
                <Button variant="contained" onClick={getStockData}>
                  Submit
                </Button>
              </form>
              <hr></hr>
              <ul>
                {books.map((book, i) => (
                  <li key={i}>
                    {book.title} - {book.author}
                  </li>
                ))}
              </ul>
            </div>
            <div 
              className={stockData.length > 0 ? classes.show : classes.hide}
              style={{
                padding: "2rem",
                border: "3px solid lightblue",
                width: "min-content",
              }}
            >
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
