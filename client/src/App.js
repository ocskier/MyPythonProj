import React, { useEffect, useState } from "react";
import clsx from 'clsx';

import { createStyles, makeStyles } from "@material-ui/core/styles";

import Chart from "./Components/Chart";
import Header from "./Components/Header";

import './App.css';

const useStyles = makeStyles((theme) =>
  createStyles({
    hide: {
      visibility: "hidden",
    },
    show: {
      visibility: "visible",
    },
    ctn: {
      display: "flex",
      justifyContent: "space-around",
      flexWrap: "wrap",
      flexDirection: "row-reverse",
      marginBottom: "120px",
    },
    chartCtn: {
      padding: "2rem",
      border: "3px solid lightblue",
      width: "min-content",
      marginTop: "8rem",
    },
    pigPic: {
      position: 'absolute',
      width: '100%',
      zIndex: -1,
      opacity: 0.66,
    }
  })
);

export const App = () => {
  const [searchedStocks, setSearchedSTocks] = useState([]);
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
        setSearchedSTocks(["SRPT", "ACAD"]);
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
      <Header search={search} setSearch={setSearch} searchClickHandler={getStockData}/>
      <img class={classes.pigPic} src='/fabian-blank-pElSkGRA2NU-unsplash.jpg'></img>
      {!error ? (
        <div className='main'>
          <p className="pt-2 text-center text-success">
            {!time ? "Loading..." : `Server time: ${time}`}
          </p>
          <div className={classes.ctn}>
            <div>
              <ul>
                {searchedStocks.map((stock, i) => (
                  <button key={i}>
                    {stock}
                  </button>
                ))}
              </ul>
            </div>
            <div className={clsx(classes.chartCtn, stockData.length > 0 ? classes.show : classes.hide)} >
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
