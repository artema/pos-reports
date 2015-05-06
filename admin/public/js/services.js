angular.module('PosReports.services', [])
.factory('DialogManager', () => {
  return new app.DialogManager();
})
.factory('MappingModel', ['StorageProvider', (StorageProvider) => {
  return new app.MappingModel(StorageProvider);
}])
.factory('ReportModel', ['ReportService', (ReportService) => {
  return new app.ReportModel(ReportService);
}])
.factory('ReportService', ['$resource', ($resource) => {
  return new app.ReportService($resource);
}])
.factory('StorageProvider', () => {
  return (id) => new app.LocalStorageStore(id);
})
.factory('QueryModel', () => {
  return new app.QueryModel();
});
