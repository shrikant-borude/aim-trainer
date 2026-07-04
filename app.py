from cs50 import SQL
from flask import Flask, render_template, request, session, redirect
from flask_session import Session

app = Flask(__name__)

app.config["SESSION_PERMANENT"] = False # Cookies should dissapear when the user quits the browser
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

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

@app.route("/login", methods=["POST", "GET"])
def login():
    return render_template("login.html")

@app.route("/signup", methods=["POST", "GET"])
def signup():
    if request.method == "GET":
        return render_template("signup.html")


# mainly for testing purposes if its (app.py as import app) imported then it does not run
if __name__ == "__main__":
    app.run(debug=True)