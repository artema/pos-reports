angular.module('PosReports.services', [])
.factory('DialogManager', () => {
  return new app.DialogManager();
})
.factory('MappingModel', () => {
  return new app.MappingModel();
})
.factory('ReportModel', ['ReportService', (ReportService) => {
  return new app.ReportModel(ReportService);
}])
.factory('ReportService', ['$resource', ($resource) => {
  return new app.ReportService($resource);
}])
.factory('QueryModel', () => {
  return new app.QueryModel();
});
