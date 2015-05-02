--pig -x local -f ./reports.pig -p INPUT=./test -p OUTPUT=./output/data
REGISTER file:/usr/local/Cellar/pig/0.14.0/libexec/lib/piggybank.jar;
--REGISTER file:/home/hadoop/pig/lib/piggybank.jar
DEFINE CSVExcelStorage org.apache.pig.piggybank.storage.CSVExcelStorage;

sales =
  LOAD '$INPUT/sales' USING CSVExcelStorage(',', 'NO_MULTILINE', 'UNIX', 'SKIP_INPUT_HEADER', 'SKIP_OUTPUT_HEADER')
  AS (
      company: chararray,
      location: chararray,
      time: datetime,
      check: chararray,
      staff: chararray,
      customer: chararray,
      item: chararray,
      price: float
  );

sales_by_check = GROUP sales BY check;

checks_by_location = FOREACH sales_by_check GENERATE
  group as check,
  BagToTuple(sales.company).$0 as company,
  BagToTuple(sales.location).$0 as location,
  BagToTuple(sales.staff).$0 as staff;

checks_totals = FOREACH sales_by_check GENERATE
  group as check,
  MAX(sales.time) as time,
  SUM(sales.price) as total;

items_by_location = FOREACH sales GENERATE
  check,
  item,
  price;

STORE checks_by_location INTO '${OUTPUT}/checks_by_location';
STORE checks_totals INTO '${OUTPUT}/checks_totals';
STORE items_by_location INTO '${OUTPUT}/items_by_location';
