from flask import Flask, jsonify, render_template, request
import requests

app = Flask(__name__)

BASE = "https://api.jolpi.ca/ergast/f1"


@app.route("/")
def index():
    return render_template("index.html")


def get_standings():
    url = f"{BASE}/current/driverStandings.json"
    data = requests.get(url, timeout=15).json()

    lists = data["MRData"]["StandingsTable"]["StandingsLists"]
    if not lists:  # season hasn't started
        return "", []

    drivers = []
    for row in lists[0]["DriverStandings"]:
        d = row["Driver"]
        drivers.append({
            "driverId": d["driverId"],
            "position": int(row["position"]),
            "fullName": d["givenName"] + " " + d["familyName"],
            "team": row["Constructors"][-1]["name"],
            "points": int(float(row["points"])),
            "wins": int(row["wins"]),
            "nationality": d["nationality"],
            "code": d.get("code", "—"),
        })
    return lists[0]["season"], drivers      


@app.route("/api/standings")               
def api_standings():
    season, drivers = get_standings()
    return jsonify({"season": season, "drivers": drivers})


@app.route("/api/schedule")
def api_schedule():
    data = requests.get(f"{BASE}/current.json?limit=100", timeout=15).json()
    table = data["MRData"]["RaceTable"]

    races = []
    for r in table["Races"]:
        loc = r["Circuit"]["Location"]
        races.append({
            "round": r["round"],
            "name": r["raceName"],
            "circuit": r["Circuit"]["circuitName"],
            "locality": loc["locality"],
            "country": loc["country"],
            "date": r["date"],
        })
    return jsonify({"races": races})


@app.route("/api/compare")
def api_compare():
    id1 = request.args.get("d1")
    id2 = request.args.get("d2")

    season, drivers = get_standings()

    d1 = None
    d2 = None
    for d in drivers:
        if d["driverId"] == id1:
            d1 = d
        if d["driverId"] == id2:
            d2 = d

    if d1 is None or d2 is None:
        return jsonify({"error": "Driver not found"}), 404

    return jsonify({"driver1": d1, "driver2": d2})


if __name__ == "__main__":
    app.run(debug=True)