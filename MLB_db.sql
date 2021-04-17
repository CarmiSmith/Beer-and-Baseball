DROP TABLE mlb_wins 
CREATE TABLE mlb_wins (
	year INT,
	team VARCHAR,
	number_of_games NUMERIC,
	wins NUMERIC
);

SELECT * FROM mlb_wins

DROP TABLE mlb_beer_prices
CREATE TABLE mlb_beer_prices (
	Year INT, 
	Team VARCHAR,
	Nickname VARCHAR,
	City VARCHAR,
	Price NUMERIC,
	Size INT,
	Price_per_Ounce NUMERIC
);

SELECT * FROM mlb_beer_prices