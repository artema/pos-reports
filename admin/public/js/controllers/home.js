angular.module('PosReports.controllers')
.controller('HomeController',
  ['$scope', '$timeout', 'MappingModel', 'ReportModel', 'QueryModel',
  ($scope, $timeout, MappingModel, ReportModel, QueryModel) => {

  function loadData() {
    ReportModel.customerAverage(QueryModel.query).then(customerAverages => {
      $timeout(() => {
        let customerAveragesSum = customerAverages.reduce((v, c) => v += c.value, 0);
        $scope.customerAverage =  Math.floor(customerAveragesSum / customerAverages.length);

        
      });
    });
  }

  loadData();
  MappingModel.changed.add(loadData);
  QueryModel.changed.add(loadData);
}]);
