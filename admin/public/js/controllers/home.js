angular.module('PosReports.controllers')
.controller('HomeController',
  ['$scope', '$timeout', 'MappingModel', 'ReportModel', 'QueryModel',
  ($scope, $timeout, MappingModel, ReportModel, QueryModel) => {

  function loadData() {
    ReportModel.customerAverage(QueryModel.query).then(customerAverages => {
      ReportModel.staffTop(QueryModel.query).then(staffs => {
        $timeout(() => {
          let customerAveragesSum = customerAverages.reduce((v, c) => v += c.value, 0);
          $scope.customerAverage =  Math.floor(customerAveragesSum / customerAverages.length);
          $scope.topStaff = staffs.filter((c, i) => i === 0).reduce((v, s) => {
            let staff = MappingModel.getStaff(s.staff_key);
            return {
              firstName: staff.firstName,
              lastName: staff.lastName
            };
          }, null);

        });
      });
    });
  }

  loadData();
  MappingModel.changed.add(loadData);
  QueryModel.changed.add(loadData);
}]);
