from cs50 import SQL
from flask import Flask, render_template, request, session, redirect
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash


app = Flask(__name__)

app.config["SESSION_PERMANENT"] = False # Cookies should dissapear when the user quits the browser
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

db = SQL("sqlite:///database.db")

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
    
    session.clear()

    if request.method == "POST":
        if not request.form.get("username"):
            return render_template("error.html", message="must provide username")
        
        elif not request.form.get("password"):
            return render_template("error.html", message="must provide password")
    
        rows = db.execute(
            "SELECT * FROM users WHERE username = ?", request.form.get("username")
        )

        if len(rows) != 1 or not check_password_hash(
            rows[0]["hash"], request.form.get("password")
        ):
            return render_template("error.html", message="invalid username and/or password")

        session["user_id"] = rows[0]["id"]
        session["user_name"] = rows[0]["username"]

        return redirect("/")

    else:
        return render_template("login.html")

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")

@app.route("/signup", methods=["POST", "GET"])
def signup():
    if request.method == "GET":
        return render_template("signup.html")

    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        confirmation = request.form.get("confirmation")

    if not username:
        return render_template("error.html", message="must provide username")

    elif not password:
        return render_template("error.html", message="must provide username")

    elif not confirmation:
        return render_template("error.html", message="must provide confirmation")

    if password != confirmation:
        return render_template("error.html", message="password and confirmation do not match")
    
    try:
        db.execute("INSERT INTO users (username, hash) VALUES (?, ?)",
                   username, generate_password_hash(password))
    
    except ValueError:
        return render_template("error.html", message="username already exists")
    return redirect("/login")


# mainly for testing purposes if its (app.py as import app) imported then it does not run
if __name__ == "__main__":
    app.run(debug=True)