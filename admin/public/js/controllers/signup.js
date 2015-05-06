angular.module('PosReports.controllers')
.controller('SignupController',
  ['$scope', '$timeout', 'DialogManager', 'UserModel',
  ($scope, $timeout, DialogManager, UserModel) => {

  $scope.signUp = () => {
    var job = DialogManager.startJob();

    UserModel.signUp({
      username: $scope.username,
      password: $scope.password
    }).then(() => {
      $timeout(() => {
        $scope.username = $scope.password = $scope.password2 = '';
      });
      DialogManager.endJob(job);
      DialogManager.alert('Пользователь успешно зарегистрирован.');
    }, e => {
      DialogManager.endJob(job);
      DialogManager.alert(e.data.message || 'Не удалось зарегистрировать.');
    });
  };
}]);
