angular.module('PosReports.controllers')
.controller('SalesController',
  ['$scope', '$timeout', 'DialogManager', 'MappingModel', 'ReportModel', 'QueryModel',
  ($scope, $timeout, DialogManager, MappingModel, ReportModel, QueryModel) => {

  function loadData() {
    var job = DialogManager.startJob();

    ReportModel.salesTotal(QueryModel.query).then(locations => {
      ReportModel.salesTotalAll(QueryModel.query).then(salesTotal => {
        $timeout(() => {
          $scope.topLocations = locations.map((c, i) => {
            let item = MappingModel.getLocation(c.location_key);
            return {
              i: i,
              name: item.name,
              total: Math.floor(c.value)
            };
          });

          $('#chart-sales-locations').empty();
          Morris.Donut({
            element: 'chart-sales-locations',
            data: locations.map(c => {
              let item = MappingModel.getLocation(c.location_key);
              return {
                label: item.name,
                value: Math.floor(c.value)
              };
            }).filter((c, i) => i < 5),
            resize: true
          });

          var itemsPopularityKeys = {};
          var itemsPopularity = salesTotal.map(group => {
            let result = {
              date: group.date
            };

            group.items.forEach(item => {
              result[item.location_key] = item.value;

              if (!itemsPopularityKeys[item.location_key]) {
                itemsPopularityKeys[item.location_key] = MappingModel.getLocation(item.location_key);
              }
            });

            return result;
          });

          itemsPopularity.reverse();

          $('#chart-sales-rates').empty();
          Morris.Area({
            element: 'chart-sales-rates',
            data: itemsPopularity,
            xkey: 'date',
            ykeys: Object.keys(itemsPopularityKeys),
            labels: Object.keys(itemsPopularityKeys).map(x => itemsPopularityKeys[x].name),
            pointSize: 2,
            hideHover: 'auto',
            resize: true,
            behaveLikeLine: true,
            parseTime: false,
            fillOpacity: 0
          });

          DialogManager.endJob(job);
        });
      });
    });
  }

  loadData();
  MappingModel.changed.add(loadData);
  QueryModel.changed.add(loadData);
}]);
