import psycopg2
import os
import pandas as pd
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

# home route


@app.route('/')
def welcome():

    return render_template('index_new.html')


# @app.route('/map')
# def map():
    #'''Main Map Route.'''

    # get default data
    #data = session.query(Passing).order_by(Passing.passing_yards.desc())

    # default dropdowns
    #options = populate_dropdown('passing')
    #options = options.json
    #options = [x.capitalize().replace('_', ' ') for x in options]

    # return render_template('map.html', data=data, options=options)


@app.route('/map/<table>/<col>')
def map_json(table, col):
    '''Returns map json data.'''

    # load map data
    map_data = json.load(open('json/states.json'))

    # load and group by player states
    data = pd.read_sql_table(table, engine)[
        ['Team', 'Price_per_Ounce', col]]

    # build geoJson data
    for ind, obj in enumerate(map_data['features']):
        initials = state_codes_mod.state_codes[map_data['features']
                                               [ind]['properties']['name']]

        # set the new density to the required stat
        try:
            map_data['features'][ind]['properties']['density'] = int(
                grouped.loc[[initials], [col]][col])
        except KeyError:
            map_data['features'][ind]['properties']['density'] = 0

    return map_data

# data return route


@app.route('/<table>/<x>/<y>')
def get_data(table, x, y):
    '''Returns JSON data from user choices.'''

    # handle x and y inputs being identical
    if(x == y):
        return jsonify([])
    # group by
    data = pd.read_sql_table(table, engine)[['Team', x, y]]

    return data.to_json()


@app.route('/<table>')
def populate_dropdown(table):
    '''Returns the columns a user can choose from.'''

    exclusions = ['Team', 'Nickname', 'City', 'Price', 'Size',
                  'Price_per_Ounce']

    options = [x for x in pd.read_sql_table(
        table, engine).columns if x not in exclusions]

    return jsonify(options)


@app.route('/table/<table>/<x>/<y>')
def get_table_data(table, x, y):
    '''Returns JSON data from user choices made for bootstrap table.'''

    # group by
    data = pd.read_sql_table(table, engine)[['Team', x, y]]

    table_data = []
    for ind, row in data.iterrows():
        d = {
            'name': row['name'],
            'x': row[x],
            'y': row[y]
        }
        table_data.append(d)

    return jsonify(table_data)


if __name__ == "__main__":
    app.run(debug=True)
