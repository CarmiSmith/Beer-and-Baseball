import psycopg2
import os
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import Flask, jsonify, render_template
import json
from flask_cors import CORS


engine = create_engine(
    "postgresql+psycopg2://postgres:postgres@localhost:5433/MLB")
cursor = engine.connect()
postgreSQL_select_Query = "select * from mlb_wins"
win_records = cursor.execute(postgreSQL_select_Query)
postgreSQL_select_Query1 = "select * from mlb_beer_prices"
beer_records = cursor.execute(postgreSQL_select_Query1)
postgreSQL_select_Query1 = "select * from mlb_combined_data"
beerwin_records = cursor.execute(postgreSQL_select_Query1)
postgreSQL_select_Query1 = "select * from average"
average_records = cursor.execute(postgreSQL_select_Query1)

app = Flask(__name__, template_folder=os.path.abspath('static'))
CORS(app)


@app.route('/')
def welcome():
    return render_template("index_new.html")


@app.route("/wins")
def teams_win():
    team_data = []
    for row in win_records:
        teams_dict = {}
        teams_dict["Year"] = row[0]
        teams_dict["Team"] = row[1]
        teams_dict["Number_of_Games"] = row[2]
        teams_dict["Wins"] = row[3]
        team_data.append(teams_dict)
    return jsonify(team_data)


@app.route("/beerprices")
def beer_prices():

    beer_price = []

    for row in beer_records:
        beer_dict = {}
        beer_dict['Year'] = row[0]
        beer_dict['Team'] = row[1]
        beer_dict['Nickname'] = row[2]
        beer_dict['City'] = row[3]
        beer_dict['Price'] = float(row[4])
        beer_dict['Size'] = row[5]
        beer_dict['Price_per_Ounce'] = float(row[6])
        beer_price.append(beer_dict)
    return jsonify(beer_price)


@app.route("/beerwins")
def beer_wins():
    beerwin_data = []
    for row in beerwin_records:
        beerwin_dict = {}
        beerwin_dict["team"] = row[0]
        beerwin_dict["city"] = row[1]
        beerwin_dict["price"] = float(row[2])
        beerwin_dict["size"] = row[3]
        beerwin_dict["price_per_ouce"] = float(row[4])
        beerwin_dict["number_of_games"] = row[5]
        beerwin_dict["wins"] = row[6]
        beerwin_data.append(beerwin_dict)
    return jsonify(beerwin_data)


@app.route("/averages")
def beer_average():
    beer_avg_data = []
    for row in average_records:
        avg_dict = {}
        avg_dict["team"] = row[0]
        avg_dict["Average_Price_per_Ounce"] = float(row[1])
        beer_avg_data.append(avg_dict)
    return jsonify(beer_avg_data)


if __name__ == "__main__":
    app.run(debug=True)
