angular.module('PosReports.controllers')
.controller('ItemsController',
  ['$scope', '$timeout', 'DialogManager', 'MappingModel', 'ReportModel', 'QueryModel',
  ($scope, $timeout, DialogManager, MappingModel, ReportModel, QueryModel) => {

  function loadData() {
    var job = DialogManager.startJob();

    ReportModel.itemPopular(QueryModel.query).then(items => {
      ReportModel.itemPair(QueryModel.query).then(pairs => {
        ReportModel.itemPopularAll(QueryModel.query).then(itemsAll => {
          $timeout(() => {
            $scope.popularItems = items.map((c, i) => {
              let item = MappingModel.getItem(c.item_key);
              return {
                i: i,
                name: item.name,
                total: Math.floor(c.value)
              };
            }).filter((c, i) => i < 10);

            $scope.pairedItems = pairs.map((c, i) => {
              let item1 = MappingModel.getItem(c.item1_key),
                  item2 = MappingModel.getItem(c.item2_key);
              return {
                i: i,
                name1: item1.name,
                name2: item2.name
              };
            }).filter((c, i) => i < 10);

            var itemsPopularityKeys = {};
            var itemsPopularity = itemsAll
            .map(group => {
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

            itemsPopularity.reverse();

            $('#chart-items-popularity').empty();
            Morris.Area({
              element: 'chart-items-popularity',
              data: itemsPopularity,
              xkey: 'date',
              ykeys: Object.keys(itemsPopularityKeys),
              labels: Object.keys(itemsPopularityKeys).map(x => itemsPopularityKeys[x].name),
              pointSize: 2,
              hideHover: 'auto',
              resize: true,
              parseTime: false
            });

            DialogManager.endJob(job);
          });
        });
      });
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
