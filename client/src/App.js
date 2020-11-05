import React, { useEffect, useState, useRef } from "react";
import { animated, useTransition, useSpring, useChain, config } from "react-spring";
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
      marginBottom: "120px",
      flexDirection: 'row-reverse',
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

const springStyles = {
  ctn: {
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(100px, 1fr))',
    gridGap: '25px',
    padding: '25px',
    background: 'white',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0px 10px 10px -5px rgba(0, 0, 0, 0.05)',
    willChange: 'width, height',
  },
  item: {
    background: "white",
    borderRadius: "5px",
    willChange: "transform, opacity",
    height: 'fit-content'
  },
};

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
        setSearchedSTocks(["SRPT", "ACAD"].map(stock=>{
          return {
            symbol: stock,
            css: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
          };
        }));
      } catch (err) {
        setError(err);
      }
    }
    fetchAllData();
  }, []);

  const getStockData = async (sym) => {
    const financeDataRaw = await fetch(`/finance-data/${sym}`);
    const financeData = await financeDataRaw.json();
    console.log(financeData);
    if (!financeData.error) {
      setStockData(
        financeData.stockData
      );
      setSymbol(financeData.symbol);
      search && setSearch('');
    } else {
      setError(financeData.error);
    }
  };

  const getNewSearch = async (e) => {
    e.preventDefault();
    getStockData(search);
  }

  const getSavedSearch = async (oldSym)=> {
    getStockData(oldSym)
  }

  const [open, setOpen] = useState(false);

  const springRef = useRef();
  const { size, opacity, ...rest } = useSpring({
    ref: springRef,
    config: config.stiff,
    from: { size: "20%", background: "hotpink" },
    to: { size: open ? "100%" : "20%", background: open ? "lightblue" : "lightgrey" },
  });

  const transRef = useRef();
  const transitions = useTransition(
    open ? searchedStocks : [],
    (item) => item.symbol,
    {
      ref: transRef,
      unique: true,
      trail: 400 / searchedStocks.length,
      from: { opacity: 0, transform: "scale(0)" },
      enter: { opacity: 1, transform: "scale(1)" },
      leave: { opacity: 0, transform: "scale(0)" },
    }
  );

  // This will orchestrate the two animations above, comment the last arg and it creates a sequence
  useChain(open ? [springRef, transRef] : [transRef, springRef], [
    0,
    open ? 0.1 : 0.6,
  ]);

  return (
    <div className="App">
      <Header
        search={search}
        setSearch={setSearch}
        searchClickHandler={getNewSearch}
      />
      <img
        className={classes.pigPic}
        src="/fabian-blank-pElSkGRA2NU-unsplash.jpg"
      ></img>
      {!error ? (
        <div className="main">
          <p className="pt-2 text-center text-success">
            {!time ? "Loading..." : `Server time: ${time}`}
          </p>
          <div className={classes.ctn}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {!open && <span style={{marginLeft: '6%'}}>Stocks</span>}
              <animated.div
                style={{
                  ...springStyles.ctn,
                  ...rest,
                  width: size,
                  height: size,
                }}
                onClick={() => setOpen((open) => !open)} >
                {transitions.map(({ item, key, props }) => (
                  <animated.div
                    key={key}
                    style={{ ...props, ...springStyles.item }}
                  >
                    <button onClick={() => getSavedSearch(item.symbol)} style={{ background: item.css, width: "100%" }}>
                      {item.symbol}
                    </button>
                  </animated.div>
                ))}
              </animated.div>
            </div>
            <div
              className={clsx(
                classes.chartCtn,
                stockData.length > 0 ? classes.show : classes.hide
              )}
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
