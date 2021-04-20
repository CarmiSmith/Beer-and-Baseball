# flask
from flask import Flask, jsonify, render_template
from flask_cors import CORS
import json

# os
import os

# import pandas
import pandas as pd

# # import state codes
# import state_codes_mod

# initialize app
app = Flask(__name__, template_folder=os.path.abspath('static')) # reference a different path for templates
CORS(app)
# setup database and sqlalchemy dependencies
from sql_setup import setup_dependencies
# engine, session, Passing, Rushing = setup_dependencies(app)

# home route
@app.route('/')
def welcome():
    '''Main Dashboard Route.'''

    # get default data
    data = session.query(Passing).order_by(Passing.passing_yards.desc())

    # default dropdowns
    options = populate_dropdown('passing')
    options = options.json
    options = [x.capitalize().replace('_', ' ') for x in options]

    return render_template('index.html', data=data, options=options)

@app.route('/map')
def map():
    '''Main Map Route.'''

    # get default data
    data = session.query(Passing).order_by(Passing.passing_yards.desc())

    # default dropdowns
    options = populate_dropdown('passing')
    options = options.json
    options = [x.capitalize().replace('_', ' ') for x in options]

    return render_template('map.html', data=data, options=options)

@app.route('/map/<table>/<col>')
def map_json(table, col):
    '''Returns map json data.'''

    # load map data
    map_data = json.load(open('json/states.json'))
    
    # load and group by player states
    player_data = pd.read_sql_table(table, engine)[['name', 'birth_place', col]]

    # handle height and weight issues
    if col in ['height', 'weight']:
        player_data[col] = player_data[col].astype(float)

    # get states and group by state of birth
    birth_place = player_data['birth_place'].str.split(' , ', n = 1, expand = True)
    player_data['birth_place_state'] = birth_place[1]
    grouped = player_data.groupby(['birth_place_state']).sum()

    # build geoJson data
    for ind, obj in enumerate(map_data['features']):
        initials = state_codes_mod.state_codes[map_data['features'][ind]['properties']['name']]

        # set the new density to the required stat
        try:
            map_data['features'][ind]['properties']['density'] = int(grouped.loc[[initials],[col]][col])
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
    data = pd.read_sql_table(table, engine)[['name', x, y]]

    return data.to_json()

@app.route('/<table>')
def populate_dropdown(table):

    '''Returns the columns a user can choose from.'''

    exclusions = ['id', 'name', 'birth_place', 'birth_date', 'college', 'experience', 'high_school', 'high_school_location', 'years_played']

    options = [x for x in pd.read_sql_table(table, engine).columns if x not in exclusions]

    return jsonify(options)

@app.route('/table/<table>/<x>/<y>')
def get_table_data(table, x, y):

    '''Returns JSON data from user choices made for bootstrap table.'''

    # group by 
    data = pd.read_sql_table(table, engine)[['name', x, y]]

    table_data = []
    for ind, row in data.iterrows():
        d = {
            'name': row['name'],
            'x': row[x],
            'y': row[y]
        }
        table_data.append(d)

    return jsonify(table_data)

def insert_data():

    '''Runs the data_insert functions to insert csv files into cloud database.'''

    import sys
    sys.path.append("..")
    import data_insert
    data_insert.insert_all()

# run app
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000)) # this sets the port to 5000 locally, and ${PORT} environment variable on Heroku
    app.run(host='0.0.0.0', port=port, debug=True)