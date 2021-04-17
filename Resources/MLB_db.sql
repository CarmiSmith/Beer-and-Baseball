CREATE TABLE mlb_wins (
	Year INT,
	Team VARCHAR PRIMARY KEY,
	Number_of_Games INT,
	Wins INT
);

SELECT * FROM mlb_wins

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


CREATE TABLE mlb_combined_data AS SELECT mlb_beer_prices.Team, 
	mlb_beer_prices.City, 
	mlb_beer_prices.Price, 
	mlb_beer_prices.Size,
	mlb_beer_prices.Price_per_Ounce, 
	mlb_wins.Number_of_Games,
	mlb_wins.Wins
FROM mlb_beer_prices
INNER JOIN mlb_wins ON mlb_beer_prices.Team = mlb_wins.Team;

SELECT * FROM mlb_combined_data
