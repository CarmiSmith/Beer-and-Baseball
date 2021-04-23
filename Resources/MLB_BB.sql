drop table averagecity;


CREATE TABLE stadium_lat_log (
	Team VARCHAR,
	City VARCHAR,
	Stadium VARCHAR,
	Latitude NUMERIC,
	Longitude NUMERIC
);
SELECT * FROM stadium_lat_log;

CREATE TABLE averagecity AS SELECT mlb_combined_data.Team,
	stadium_lat_log.City,
	stadium_lat_log.Stadium,
	stadium_lat_log.Latitude,
	stadium_lat_log.Longitude,
	ROUND(AVG(price_per_ounce),2) AS "Average_Price_per_Ounce",
	ROUND(AVG(wins),0) AS "Wins"
FROM mlb_combined_data
INNER JOIN stadium_lat_log ON mlb_combined_data.Team = stadium_lat_log.Team
Group BY mlb_combined_data.Team, stadium_lat_log.City, stadium_lat_log.Stadium, stadium_lat_log.Latitude, stadium_lat_log.Longitude;
select * from averagecity;