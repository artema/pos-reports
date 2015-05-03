--hive -f ./reports.q -d INPUT='/Users/Artem/Projects/github/pos-reports/emr/output/data' -d OUTPUT='/Users/Artem/Projects/github/pos-reports/emr/output/reports'

--
-- Input
--

  DROP TABLE IF EXISTS checks_by_location;
  CREATE EXTERNAL TABLE checks_by_location
  (
    check string, company int, location string, customer string, staff string
  )
  ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t' LOCATION '${INPUT}/checks_by_location/';


  DROP TABLE IF EXISTS checks_totals;
  CREATE EXTERNAL TABLE checks_totals
  (
    check string, time string, total float
  )
  ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t' LOCATION '${INPUT}/checks_totals/';


  DROP TABLE IF EXISTS items_by_check;
  CREATE EXTERNAL TABLE items_by_check
  (
    check string, item string, price float
  )
  ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t' LOCATION '${INPUT}/items_by_check/';

--
-- Output
--

  DROP TABLE IF EXISTS report_customer_average;
  CREATE TABLE report_customer_average
  (
    company int,
    location string,
    value float
  )
  ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n' STORED AS TEXTFILE
  LOCATION '${OUTPUT}/report-customer-average';


  DROP TABLE IF EXISTS report_customer_top;
  CREATE TABLE report_customer_top
  (
    company int,
    customer string,
    value float
  )
  ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n' STORED AS TEXTFILE
  LOCATION '${OUTPUT}/report-customer-top';


  DROP TABLE IF EXISTS report_item_pair;
  CREATE TABLE report_item_pair
  (
    company int,
    location string,
    item1 string,
    item2 string
  )
  ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n' STORED AS TEXTFILE
  LOCATION '${OUTPUT}/report-item-pair';

  DROP TABLE IF EXISTS report_item_popular;
  CREATE TABLE report_item_popular
  (
    company int,
    location string,
    item string,
    count int
  )
  ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n' STORED AS TEXTFILE
  LOCATION '${OUTPUT}/report-item-popular';


  DROP TABLE IF EXISTS report_item_top;
  CREATE TABLE report_item_top
  (
    company int,
    location string,
    item string,
    count int
  )
  ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n' STORED AS TEXTFILE
  LOCATION '${OUTPUT}/report-item-top';


  DROP TABLE IF EXISTS report_sales_total;
  CREATE TABLE report_sales_total
  (
    company int,
    location string,
    total float
  )
  ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n' STORED AS TEXTFILE
  LOCATION '${OUTPUT}/report-sales-total';


  DROP TABLE IF EXISTS report_staff_top;
  CREATE TABLE report_staff_top
  (
    company int,
    location string,
    staff string,
    total float
  )
  ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n' STORED AS TEXTFILE
  LOCATION '${OUTPUT}/report-staff-top';

--
-- Scripts
--

  INSERT OVERWRITE TABLE report_customer_average
  SELECT checks_by_location.company, checks_by_location.location, AVG(checks_totals.total)
  FROM checks_totals
  JOIN checks_by_location ON checks_totals.check = checks_by_location.check
  GROUP BY checks_by_location.location, checks_by_location.company;

  INSERT OVERWRITE TABLE report_customer_top
  SELECT checks_by_location.company, checks_by_location.customer, SUM(checks_totals.total)
  FROM checks_totals
  JOIN checks_by_location ON checks_totals.check = checks_by_location.check
  WHERE checks_by_location.customer != ''
  GROUP BY checks_by_location.location, checks_by_location.company, checks_by_location.customer;

  INSERT OVERWRITE TABLE report_item_pair
  SELECT l.company as company, l.location as location, i1.item as item1, i2.item as item2
  FROM items_by_check i1
  JOIN items_by_check i2 ON i1.check = i2.check
  JOIN checks_by_location l ON i1.check = l.check
  WHERE i1.item != i2.item
  GROUP BY l.company, l.location, i1.item, i2.item
  HAVING COUNT(i1.item) > 1;

  INSERT OVERWRITE TABLE report_item_popular
  SELECT checks_by_location.company, checks_by_location.location, items_by_check.item, COUNT(items_by_check.item)
  FROM items_by_check
  JOIN checks_by_location ON items_by_check.check = checks_by_location.check
  GROUP BY checks_by_location.company, checks_by_location.location, items_by_check.item
  HAVING COUNT(items_by_check.item) > 1;

  INSERT OVERWRITE TABLE report_item_top
  SELECT checks_by_location.company, checks_by_location.location, items_by_check.item, SUM(items_by_check.price)
  FROM items_by_check
  JOIN checks_by_location ON items_by_check.check = checks_by_location.check
  GROUP BY checks_by_location.company, checks_by_location.location, items_by_check.item;

  INSERT OVERWRITE TABLE report_staff_top
  SELECT checks_by_location.company, checks_by_location.location, checks_by_location.staff, SUM(checks_totals.total)
  FROM checks_totals
  JOIN checks_by_location ON checks_totals.check = checks_by_location.check
  GROUP BY checks_by_location.company, checks_by_location.location, checks_by_location.staff;

  INSERT OVERWRITE TABLE report_sales_total
  SELECT checks_by_location.company, checks_by_location.location, SUM(checks_totals.total)
  FROM checks_totals
  JOIN checks_by_location ON checks_totals.check = checks_by_location.check
  GROUP BY checks_by_location.location, checks_by_location.company;
