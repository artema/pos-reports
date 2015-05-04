angular.module('PosReports.controllers')
.controller('ItemsController',
  ['$scope', '$timeout', 'MappingModel', 'ReportModel', 'QueryModel',
  ($scope, $timeout, MappingModel, ReportModel, QueryModel) => {

  $scope.popularItems = [];

  function loadData() {
    ReportModel.itemPopular(QueryModel.query).then(items => {
      $timeout(() => $scope.popularItems = items.map((c, i) => {
        let item = MappingModel.getItem(c.item_key);
        return {
          i: i,
          name: item.name,
          total: Math.floor(c.value)
        };
      }).filter((c, i) => i < 10));
    });
  }

  loadData();
  MappingModel.changed.add(loadData);
  QueryModel.changed.add(loadData);
}]);
