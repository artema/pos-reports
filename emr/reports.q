DROP TABLE IF EXISTS checks_by_location;

CREATE EXTERNAL TABLE checks_by_location
(
  check string, company string, location string, staff string
)
ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
LOCATION '${INPUT}/checks_by_location/';


DROP TABLE IF EXISTS checks_totals;

CREATE EXTERNAL TABLE checks_totals
(
  check string, time string, total float
)
ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
LOCATION '${INPUT}/checks_totals/';


DROP TABLE IF EXISTS items_by_location;

CREATE EXTERNAL TABLE items_by_location
(
  check string, item string, price float
)
ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
LOCATION '${INPUT}/items_by_location/';
