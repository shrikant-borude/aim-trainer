from cs50 import SQL
from flask import Flask, render_template, request, session, redirect, jsonify
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash


app = Flask(__name__)

app.config["SESSION_PERMANENT"] = False # Cookies should dissapear when the user quits the browser
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

db = SQL("sqlite:///database.db")

@app.route("/")
def index():
    statistics = None
    if "user_id" in session:
        statistics = db.execute("SELECT average FROM user_stats WHERE user_id = ? AND mode_id = ?", session["user_id"], 1)
    return render_template("reaction.html", statistics=statistics)

@app.route("/flicking")
def flicking():
    statistics = None
    if "user_id" in session:
        statistics = db.execute("SELECT accuracy, average FROM user_stats WHERE user_id = ? AND mode_id = ?", session["user_id"], 2)
    return render_template("flicking.html", statistics=statistics)

@app.route("/clickspeed")
def clickspeed():
    statistics = None
    if "user_id" in session:
        statistics = db.execute("SELECT average, score FROM user_stats WHERE user_id = ? AND mode_id = ?", session["user_id"], 3)
    return render_template("clickspeed.html", statistics=statistics)

@app.route("/precision")
def precision():
    statistics = None
    if "user_id" in session:
        statistics = db.execute("SELECT accuracy, score FROM user_stats WHERE user_id = ? AND mode_id = ?", session["user_id"], 4)
    return render_template("precision.html", statistics=statistics)

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

@app.route("/save_stats", methods=["POST"])
def save_stats():
    # requesting a json file from the client
    data = request.get_json() 

    mode_id = data["mode_id"]
    accuracy = data["accuracy"]
    average = data["average"]
    score = data["score"]

    db.execute(
        "INSERT INTO user_stats (mode_id, user_id, accuracy, average, score) VALUES (?, ?, ?, ?, ?)", mode_id, session["user_id"], accuracy, average, score
        )
    
    return jsonify({"success": True})

@app.route("/login_status")
def login_status():
    return {
        "logged_in": "user_id" in session 
    }


# mainly for testing purposes if its (app.py as import app) imported then it does not run
if __name__ == "__main__":
    app.run(debug=True)