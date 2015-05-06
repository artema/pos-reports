angular.module('PosReports.controllers')
.controller('NavigationController',
  ['$scope', '$timeout', 'DialogManager', 'UserModel',
  ($scope, $timeout, DialogManager, UserModel) => {

  $scope.logout = () => {
    DialogManager.startJob();
    UserModel.logout();
  };
}]);
