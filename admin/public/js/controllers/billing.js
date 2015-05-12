angular.module('PosReports.controllers')
.controller('BillingController',
  ['$scope', '$timeout', 'DialogManager', 'ReportModel', 'QueryModel',
  ($scope, $timeout, DialogManager, ReportModel, QueryModel) => {

  function loadData() {
    var job = DialogManager.startJob();

    ReportModel.billing(QueryModel.query).then(billings => {
      DialogManager.endJob(job);

      $timeout(() => {
        $scope.billingItems = billings.map((c, i) => {console.log(c);
          return {
            i: i,
            date: c.date,
            sales: c.sales,
            price: c.sales * 3
          };
        });

        $scope.billingTotal = $scope.billingItems.reduce((v,i) => {
          v.sales += i.sales;
          v.price += i.price;
          return v;
        }, {
          sales: 0,
          price: 0
        });
      });
    });
  }

  loadData();
  QueryModel.changed.add(loadData);

  $scope.$on('$destroy', () => {
    QueryModel.changed.remove(loadData);
  });
}]);
