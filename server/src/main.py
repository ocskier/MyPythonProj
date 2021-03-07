import requests
import time
import flask
from flask import Flask, request, jsonify, render_template
from requests.exceptions import RequestException

app = flask.Flask(__name__, static_url_path='', static_folder='build', template_folder="build")

# app.config["DEBUG"] = True

app.config.from_pyfile('settings.py')

# Create some test data for our catalog in the form of a list of dictionaries.
stocks = []

# @app.route('/api/v1/resources/stocks/all', methods=['GET'])


@app.route('/api/stocks', methods=['GET'])
def api_id():
    # Check if an ID was provided as part of the URL.
    # If ID is provided, assign it to a variable.
    # If no ID is provided, display an error in the browser.
    if 'id' in request.args:
        id = int(request.args['id'])
    else:
        return jsonify(stocks)

    # Create an empty list for our results
    results = []

    # Loop through the data and match results that fit the requested ID.
    # IDs are unique, but other fields might return many results
    for stock in stocks:
        if stock['id'] == id:
            results.append(stock)

    # Use the jsonify function from Flask to convert our list of
    # Python dictionaries to the JSON format.
    return jsonify(results)


@app.route("/current-time")
def get_timestamp():
    return {'time': time.time()}


@app.route("/finance-data/<symbol>", methods=['GET'])
def get_finance_data(symbol):
    querystring1 = {"symbol":symbol,"region":"US"}
    querystring2 = {"region": "US", "comparisons": "XBI",
                   "symbol": symbol, "interval": "1d", "range": "6mo"}

    headers = {
        'x-rapidapi-host': "apidojo-yahoo-finance-v1.p.rapidapi.com",
        'x-rapidapi-key': app.config.get("API_KEY")
    }
    try:
        response1 = requests.get(
            "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-profile", headers=headers, params=querystring1)
        response2 = requests.get(
            "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-charts", headers=headers, params=querystring2)
    except RequestException:
        print("Error with Data!")

    profile_data = response1.json()
    price_data = response2.json()
    filtered_stock_prices = []
    for index, price in enumerate(price_data['chart']['result'][0]['indicators']['adjclose'][0]['adjclose']):
        filtered_stock_prices.append(
            {"close": price, "time": price_data['chart']['result'][0]['timestamp'][index] * 1000})

    return jsonify({"site": profile_data["assetProfile"]["website"],"symbol": price_data['chart']['result'][0]['meta']['symbol'], "stockData": filtered_stock_prices,'error': price_data['chart']['error']})

@app.route("/")
def my_index():
    return render_template("index.html")

# financeData.chart.result[0].indicators.adjclose[0].adjclose.map(
#           (close, i) => {
#             return {
#               close: close,
#               time: financeData.chart.result[0].timestamp[i] * 1000,
#             };
#           }
#         )
