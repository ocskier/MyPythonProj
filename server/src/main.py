import requests
import time
import flask
from flask import Flask, request, jsonify

app = flask.Flask(__name__)

app.config["DEBUG"] = True

app.config.from_pyfile('settings.py')

# Create some test data for our catalog in the form of a list of dictionaries.
books = [
    {
        "title": "The Dead Zone",
        "author": "Stephen King",
        "synopsis":
        "A number-one national best seller about a man who wakes up from a five-year coma able to see people's futures and the terrible fate awaiting mankind in The Dead Zone - a \"compulsive page-turner\" (The Atlanta Journal-Constitution). Johnny Smith awakens from a five-year coma after his car accident and discovers that he can see people's futures and pasts when he touches them. Many consider his talent a gift; Johnny feels cursed. His fiancée married another man during his coma, and people clamor for him to solve their problems. When Johnny has a disturbing vision after he shakes the hand of an ambitious and amoral politician, he must decide if he should take drastic action to change the future. The Dead Zone is a \"faultlessly paced...continuously engrossing\" (Los Angeles Times) novel of second sight.",
        "date": time.gmtime()
    },
]


# @app.route('/api/v1/resources/books/all', methods=['GET'])
# def api_all():
#     return jsonify(books)


@app.route('/api/books', methods=['GET'])
def api_id():
    # Check if an ID was provided as part of the URL.
    # If ID is provided, assign it to a variable.
    # If no ID is provided, display an error in the browser.
    if 'id' in request.args:
        id = int(request.args['id'])
    else:
        return jsonify(books)

    # Create an empty list for our results
    results = []

    # Loop through the data and match results that fit the requested ID.
    # IDs are unique, but other fields might return many results
    for book in books:
        if book['id'] == id:
            results.append(book)

    # Use the jsonify function from Flask to convert our list of
    # Python dictionaries to the JSON format.
    return jsonify(results)


@app.route("/current-time")
def get_timestamp():
    return {'time': time.time()}


@app.route("/finance-data/<symbol>", methods=['GET'])
def get_finance_data(symbol):
    querystring = {"region": "US", "comparisons": "XBI",
                   "symbol": symbol, "interval": "1d", "range": "6mo"}

    headers = {
        'x-rapidapi-host': "apidojo-yahoo-finance-v1.p.rapidapi.com",
        'x-rapidapi-key': app.config.get("API_KEY")
    }
    response = requests.get(
        "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-charts", headers=headers, params=querystring)
    data = response.json()

    filtered_stock_prices = []
    for index, price in enumerate(data['chart']['result'][0]['indicators']['adjclose'][0]['adjclose']):
        filtered_stock_prices.append(
            {"close": price, "time": data['chart']['result'][0]['timestamp'][index] * 1000})

    return jsonify({"symbol": data['chart']['result'][0]['meta']['symbol'], "stockData": filtered_stock_prices,'error': data['chart']['error']})

app.run()

# financeData.chart.result[0].indicators.adjclose[0].adjclose.map(
#           (close, i) => {
#             return {
#               close: close,
#               time: financeData.chart.result[0].timestamp[i] * 1000,
#             };
#           }
#         )
