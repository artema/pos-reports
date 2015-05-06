angular.module('PosReports.controllers')
.controller('MainMenuController',
  ['$scope', '$timeout', 'QueryModel',
  ($scope, $timeout, QueryModel) => {

  $scope.year = QueryModel.year;
  $scope.month = QueryModel.month;
  $scope.query = {
    year: QueryModel.year,
    month: QueryModel.month
  };

  $scope.years = [
    { name: '2015', value: 2015 }
  ];

  let month = [
    { name: 'Январь', value: 0 },
    { name: 'Февраль', value: 1 },
    { name: 'Март', value: 2},
    { name: 'Апрель', value: 3 },
    { name: 'Май', value: 4 },
    { name: 'Июнь', value: 5 },
    { name: 'Июль', value: 6 },
    { name: 'Август', value: 7 },
    { name: 'Сентябрь', value: 8 },
    { name: 'Октябрь', value: 9 },
    { name: 'Ноябрь', value: 10 },
    { name: 'Декабрь', value: 11 }
  ];

  $scope.months = month.filter(m => m.value <= QueryModel.month);

  $scope.updateQuery = () => {
    QueryModel.year = $scope.query.year;
    QueryModel.month = $scope.query.month;
  };
}]);
