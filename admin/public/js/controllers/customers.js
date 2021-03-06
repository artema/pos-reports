angular.module('PosReports.controllers')
.controller('CustomersController',
  ['$scope', '$timeout', 'DialogManager', 'MappingModel', 'ReportModel', 'QueryModel',
  ($scope, $timeout, DialogManager, MappingModel, ReportModel, QueryModel) => {

  $scope.topCustomers = [];

  function loadData() {
    var job = DialogManager.startJob();

    ReportModel.customerTop(QueryModel.query).then(customers => {
      $timeout(() => $scope.topCustomers = customers.map((c, i) => {
        let customer = MappingModel.getCustomer(c.customer_key);
        return {
          i: i,
          firstName: customer.firstName,
          lastName: customer.lastName,
          total: Math.floor(c.value)
        };
      }).filter((c, i) => i < 10));

      $('#chart-customer-average').empty();
      ReportModel.customerAverage(QueryModel.query).then(averages => {
        Morris.Bar({
          element: 'chart-customer-average',
          data: averages.map(avg => {
            return {
              label: MappingModel.getLocation(avg.location_key).name,
              value: Math.floor(avg.value)
            };
          }).filter((c, i) => i < 5),
          xkey: 'label',
          ykeys: ['value'],
          labels: ['Средний чек'],
          hideHover: 'auto',
          resize: true
        });
      });

      DialogManager.endJob(job);
    });
  }

  loadData();
  MappingModel.changed.add(loadData);
  QueryModel.changed.add(loadData);

  $scope.$on('$destroy', () => {
    MappingModel.changed.remove(loadData);
    QueryModel.changed.remove(loadData);
  });
}]);
