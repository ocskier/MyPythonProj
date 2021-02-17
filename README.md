# Stock Dashboard
  
  <img style="border-radius: 20px;" src="https://img.shields.io/static/v1?label=LICENSE&message=MIT&color=BLUE&style=for-the-badge">

<br>

A full stack project built with Python, Flask, and Create-React-App for financial stock performance.

<br>

<img width=200 height=200 src="client\public\fabian-blank-pElSkGRA2NU-unsplash.jpg">

## Prerequisites

<a href="https://nodejs.org/en/"><img width=80 height=80 src="./logo.svg"></a>

* pipenv
* Node 12.12
* Yarn 1.19

## Installation

 - Clone the repo
 - Add a `.flaskenv` file with the following:

```python
FLASK_ENV=development
FLASK_APP=./server/src/main.py
```

- Add a `.env` file with the following:

```python
RAPID_API_KEY=YOURKEY
```

- Run

```bash
yarn install
```

## Usage

```bash
yarn dev:start
```

## Running Tests

```bash
yarn test
```

## Deployment

Heroku

## Authors

[Jon Jackson](http://github.com/ocskier)

## Contributing
Please make sure to update tests as appropriate.

## License

MIT

