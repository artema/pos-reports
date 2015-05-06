angular.module('PosReports.controllers')
.controller('ProfileController',
  ['$scope', '$timeout', 'DialogManager', 'UserModel',
  ($scope, $timeout, DialogManager, UserModel) => {

  $scope.changePassword = () => {
    var job = DialogManager.startJob();

    UserModel.changePassword({
      old_password: $scope.oldPassword,
      new_password: $scope.newPassword
    }).then(() => {
      UserModel.logout();
    }, e => {
      DialogManager.endJob(job);
      DialogManager.alert(e.data.message || 'Не удалось сменить пароль.');
    });
  };
}]);
