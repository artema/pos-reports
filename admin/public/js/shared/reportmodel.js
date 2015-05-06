window.app.ReportModel = class ReportModel {
  constructor(ReportService) {
    this._ReportService = ReportService;
  }

  customerTop(query) {
    return this._ReportService.customerTop(query).then(data => {
      let items = data.reduce((result, entry) => {
        if (!result[entry.customer_key]) {
          result[entry.customer_key] = entry;
          delete entry.date;
        }
        else {
          result[entry.customer_key].value += entry.value;
        }

        return result;
      }, {});

      return Object.keys(items)
        .map(key => items[key])
        .sort((a, b) => {
          if (a.value > b.value) { return -1; }
          if (a.value < b.value) { return 1; }
          return 0;
        });
    });
  }

  customerAverage(query) {
    return this._ReportService.customerAverage(query).then(data => {
      let items = data.reduce((result, entry) => {
        let item = result[entry.location_key];

        if (!item) {
          result[entry.location_key] = item = entry;
          item.count = 0;
          delete entry.date;
        }
        else {
          item.value += entry.value;
        }

        item.count++;
        return result;
      }, {});

      return Object.keys(items)
        .map(key => {
          let item = items[key];
          item.value = item.value / item.count;

          delete item.count;

          return item;
        })
        .sort((a, b) => {
          if (a.value > b.value) { return -1; }
          if (a.value < b.value) { return 1; }
          return 0;
        });
    });
  }

  itemPair(query) {
    return this._ReportService.itemPair(query).then(data => {
      let items = data.reduce((result, entry) => {
        let item = result[entry.item1_key];

        if (!item) {
          result[entry.item1_key] = item = {};
          item.count = 0;
        }

        item[entry.item2_key] = (item[entry.item2_key] || 0) + 1;

        return result;
      }, {});

      Object.keys(items).forEach(key => {
        items[key] = Object.keys(items[key])
          .sort((a, b) => {
            if (items[key][a] > items[key][b]) { return -1; }
            if (items[key][a] < items[key][b]) { return 1; }
            return 0;
          })[0];

        let key2 = items[key];

        if (items[key2]) {
          let key1 = items[key2];

          if (key === key1) {
            delete items[key1];
          }
        }
      });

      return Object.keys(items)
        .map(key => {
          return {
            item1_key: key,
            item2_key: items[key]
          };
        });
    });
  }

  itemPopular(query) {
    return this._ReportService.itemPopular(query).then(data => {
      let items = data.reduce((result, entry) => {
        let item = result[entry.item_key];

        if (!item) {
          result[entry.item_key] = item = entry;
          delete entry.date;
          delete entry.location_key;
        }
        else {
          item.value += entry.value;
        }

        return result;
      }, {});

      return Object.keys(items)
        .map(key => items[key])
        .sort((a, b) => {
          if (a.value > b.value) { return -1; }
          if (a.value < b.value) { return 1; }
          return 0;
        });
    });
  }

  itemPopularAll(query) {
    return this._ReportService.itemPopular(query).then(data => {
      var totals = {};

      let items = data.reduce((result, entry) => {
        let item = result[entry.item_key];

        if (!item) {
          result[entry.item_key] = item = {};
        }

        item[entry.date] = (item[entry.date] || 0) + entry.value;
        totals[entry.item_key] = (totals[entry.item_key] || 0) + entry.value;

        return result;
      }, {});

      var actual = Object.keys(totals)
        .sort((a, b) => {
          if (totals[a] > totals[b]) { return -1; }
          if (totals[a] < totals[b]) { return 1; }
          return 0;
        })
        .filter((c, i) => i < 5);

      let output = Object.keys(items)
        .reduce((result, key) => {
          Object.keys(items[key]).map(k => {
            return {
              item_key: key,
              date: k,
              value: items[key][k]
            };
          })
          .forEach(item => {
            if (actual.indexOf(item.item_key) !== -1) {
              result.push(item);
            }
          });

          return result;
        }, [])
        .reduce((result, item) => {
          let group = result[item.date];

          if (!group) {
            result[item.date] = group = {
              date: item.date,
              items: []
            };
          }

          group.items.push(item);

          return result;
        }, {});

      return Object.keys(output)
        .map(x => output[x])
        .sort((a, b) => {
          let date1 = moment(a.date),
              date2 = moment(b.date);

          if (date1.isAfter(date2)) { return -1; }
          if (date2.isAfter(date1)) { return 1; }
          return 0;
        });
    });
  }

  staffTop(query) {
    return this._ReportService.staffTop(query).then(data => {
      let items = data.reduce((result, entry) => {
        let item = result[entry.staff_key];

        if (!item) {
          result[entry.staff_key] = item = entry;
          delete entry.date;
        }
        else {
          item.value += entry.value;
        }

        return result;
      }, {});

      return Object.keys(items)
        .map(key => items[key])
        .sort((a, b) => {
          if (a.value > b.value) { return -1; }
          if (a.value < b.value) { return 1; }
          return 0;
        });
    });
  }

  salesTotal(query) {
    return this._ReportService.salesTotal(query).then(data => {
      let items = data.reduce((result, entry) => {
        let item = result[entry.location_key];

        if (!item) {
          result[entry.location_key] = item = entry;
          delete entry.date;
        }
        else {
          item.value += entry.value;
        }

        return result;
      }, {});

      return Object.keys(items)
        .map(key => items[key])
        .sort((a, b) => {
          if (a.value > b.value) { return -1; }
          if (a.value < b.value) { return 1; }
          return 0;
        });
    });
  }

  salesTotalAll(query) {
    return this._ReportService.salesTotal(query).then(data => {
      let items = data.reduce((result, entry) => {
        let group = result[entry.date];

        if (!group) {
          result[entry.date] = group = {
            date: entry.date,
            items: []
          };
        }

        delete entry.date;
        group.items.push(entry);

        return result;
      }, {});

      return Object.keys(items)
        .map(key => items[key])
        .sort((a, b) => {
          let date1 = moment(a.date),
              date2 = moment(b.date);

          if (date1.isAfter(date2)) { return -1; }
          if (date2.isAfter(date1)) { return 1; }
          return 0;
        });
    });
  }

  uploadData(request) {
    return this._ReportService.uploadData(request);
  }
};
