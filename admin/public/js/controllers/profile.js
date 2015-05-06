angular.module('PosReports.controllers')
.controller('ProfileController',
  ['$scope', '$timeout', 'DialogManager', 'UserModel',
  ($scope, $timeout, DialogManager, UserModel) => {

  function loadData() {
    var job = DialogManager.startJob();

    UserModel.getProfile().then(profile => {
      $timeout(() => {
        $scope.authToken = profile.auth_token;
        $scope.companyName = profile.company;
      });
      DialogManager.endJob(job);
    });
  }

  loadData();

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

  $scope.generateToken = () => {
    var job = DialogManager.startJob();

    UserModel.generateAuthToken().then(result => {
      $timeout(() => {
        $scope.authToken = result.token;
      });
      DialogManager.endJob(job);
    }, e => {
      DialogManager.endJob(job);
      DialogManager.alert(e.data.message || 'Не удалось выполнить операцию.');
    });
  };
}]);
