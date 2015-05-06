angular.module('PosReports.controllers')
.controller('StaffController',
  ['$scope', '$timeout', 'DialogManager', 'MappingModel', 'ReportModel', 'QueryModel',
  ($scope, $timeout, DialogManager, MappingModel, ReportModel, QueryModel) => {

  $scope.topStaff = [];

  function loadData() {
    var job = DialogManager.startJob();

    ReportModel.staffTop(QueryModel.query).then(staffs => {
      $timeout(() => {
        $scope.topStaff = staffs.map((c, i) => {
          let staff = MappingModel.getStaff(c.staff_key);
          return {
            i: i,
            firstName: staff.firstName,
            lastName: staff.lastName,
            location: MappingModel.getLocation(c.location_key).name,
            total: Math.floor(c.value)
          };
        }).filter((c, i) => i < 10);

        DialogManager.endJob(job);
      });
    });
  }

  loadData();
  MappingModel.changed.add(loadData);
  QueryModel.changed.add(loadData);
}]);
