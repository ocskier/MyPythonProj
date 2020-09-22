import time
from flask import Flask

app = Flask("__main__")

@app.route("/")
def root():
  return 'Sanity check!'

@app.route("/current-time")
def get_timestamp():
  return {'time': time.time()}
  