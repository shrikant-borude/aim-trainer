from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/clickspeed")
def clickspeed():
    return render_template("clickspeed.html")

@app.route("/flicking")
def flicking():
    return render_template("flicking.html")

@app.route("/precision")
def precision():
    return render_template("precision.html")

# mainly for testing purposes if its (app.py as import app) imported then it does not run
if __name__ == "__main__":
    app.run(debug=True)