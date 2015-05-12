window.app.ReportService = class ReportService {
  constructor($resource) {
    this._api = {
      'billing': $resource('/api/report/billing', {}, { query: { method: 'GET', isArray: true } }),
      'customerAverage': $resource('/api/report/customer-average', {}, { query: { method: 'GET', isArray: true } }),
      'customerTop': $resource('/api/report/customer-top', {}, { query: { method: 'GET', isArray: true } }),
      'itemPair': $resource('/api/report/item-pair', {}, { query: { method: 'GET', isArray: true } }),
      'itemPopular': $resource('/api/report/item-popular', {}, { query: { method: 'GET', isArray: true } }),
      'itemTop': $resource('/api/report/item-top', {}, { query: { method: 'GET', isArray: true } }),
      'salesTotal': $resource('/api/report/sales-total', {}, { query: { method: 'GET', isArray: true } }),
      'staffTop': $resource('/api/report/staff-top', {}, { query: { method: 'GET', isArray: true } }),
      'uploadData': $resource('/api/report', {}, { query: { method: 'POST' } })
    };
  }

  billing(query) {
    return this._api.billing.query(this._getQuery(query)).$promise;
  }

  customerAverage(query) {
    return this._api.customerAverage.query(this._getQuery(query)).$promise;
  }

  customerTop(query) {
    return this._api.customerTop.query(this._getQuery(query)).$promise;
  }

  itemPair(query) {
    return this._api.itemPair.query(this._getQuery(query)).$promise;
  }

  itemPopular(query) {
    return this._api.itemPopular.query(this._getQuery(query)).$promise;
  }

  itemTop(query) {
    return this._api.itemTop.query(this._getQuery(query)).$promise;
  }

  salesTotal(query) {
    return this._api.salesTotal.query(this._getQuery(query)).$promise;
  }

  staffTop(query) {
    return this._api.staffTop.query(this._getQuery(query)).$promise;
  }

  uploadData(request) {
    return this._api.uploadData.query(request).$promise;
  }

  _getQuery(query) {
    return {
      date: query.date,
      days: query.days
    };
  }
};
