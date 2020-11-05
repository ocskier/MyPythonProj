import requests
import time
import flask
from flask import Flask, request, jsonify, render_template

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
