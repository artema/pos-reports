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
};
