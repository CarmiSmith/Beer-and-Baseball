DROP TABLE mlb_teams 
CREATE TABLE mlb_wins (
	Year INT,
	Team VARCHAR,
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

CREATE TABLE mlb_teams AS SELECT mlb_beer_prices.Team,  
	mlb_beer_prices.Price_per_Ounce
FROM mlb_beer_prices;

SELECT * FROM mlb_teams


CREATE TABLE average AS SELECT team, ROUND(AVG(price_per_ounce),2) AS "Average_Price_per_Ounce"
FROM mlb_combined_data
GROUP BY team;

CREATE TABLE averagecity AS SELECT mlb_combined_data.Team, mlb_combined_data.City, ROUND(AVG(price_per_ounce),2) AS "Average_Price_per_Ounce"
FROM mlb_combined_data
GROUP BY Team, City;

CREATE TABLE teambeers AS SELECT  mlb_beer_prices.Team,  ROUND(AVG(mlb_beer_prices.price_per_ounce),2) AS "Average_Price_per_Ounce",  mlb_wins.year, mlb_wins.Wins
FROM mlb_beer_prices
INNER JOIN mlb_wins ON mlb_beer_prices.Team = mlb_wins.Team
GROUP BY mlb_beer_prices.team, mlb_wins.year, mlb_wins.Wins
ORDER BY mlb_beer_prices.team;