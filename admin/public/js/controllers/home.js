angular.module('PosReports.controllers')
.controller('HomeController',
  ['$scope', '$timeout', 'DialogManager', 'MappingModel', 'ReportModel', 'QueryModel',
  ($scope, $timeout, DialogManager, MappingModel, ReportModel, QueryModel) => {

  function loadData() {
    var job = DialogManager.startJob();

    ReportModel.customerAverage(QueryModel.query).then(customerAverages => {
      ReportModel.staffTop(QueryModel.query).then(staffs => {
        ReportModel.itemPopular(QueryModel.query).then(items => {
          ReportModel.itemPopularAll(QueryModel.query).then(itemsAll => {
            ReportModel.salesTotal(QueryModel.query).then(locations => {
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

                $scope.topItem = items.filter((c, i) => i === 0).reduce((v, s) => {
                  let item = MappingModel.getItem(s.item_key);
                  return {
                    name: item.name
                  };
                }, null);

                $scope.salesTotal = locations.reduce((value, l) => value += l.value, 0);

                var itemsPopularityKeys = {};
                var itemsPopularity = itemsAll.map(group => {
                  let result = {
                    date: group.date
                  };

                  group.items.forEach(item => {
                    result[item.item_key] = item.value;

                    if (!itemsPopularityKeys[item.item_key]) {
                      itemsPopularityKeys[item.item_key] = MappingModel.getItem(item.item_key);
                    }
                  });

                  return result;
                });

                $('#chart-home-item-top').empty();
                Morris.Area({
                  element: 'chart-home-item-top',
                  data: itemsPopularity,
                  xkey: 'date',
                  ykeys: Object.keys(itemsPopularityKeys),
                  labels: Object.keys(itemsPopularityKeys).map(x => itemsPopularityKeys[x].name),
                  pointSize: 2,
                  hideHover: 'auto',
                  resize: true
                });

                $('#chart-home-locations').empty();
                Morris.Donut({
                  element: 'chart-home-locations',
                  data: locations.map(c => {
                    let item = MappingModel.getLocation(c.location_key);
                    return {
                      label: item.name,
                      value: Math.floor(c.value)
                    };
                  }).filter((c, i) => i < 5),
                  resize: true
                });

                DialogManager.endJob(job);
              });
            });
          });
        });
      });
    });
  }

  loadData();
  MappingModel.changed.add(loadData);
  QueryModel.changed.add(loadData);
}]);
