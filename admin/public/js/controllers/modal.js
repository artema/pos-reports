angular.module('PosReports.controllers')
.controller('ModalController',
  ['$scope', '$timeout', 'DialogManager',
  ($scope, $timeout, DialogManager) => {

  var alertStack = [];
  var confirmStack = [];
  var alertIndex = -1;
  var confirmIndex = -1;
  var busyDialog, alertDialog, confirmDialog = null;

  var showNextAlert = function() {
    if (alertDialog) {
      return;
    }

    alertIndex++;

    if (alertIndex === alertStack.length) {
      alertStack = [];
      alertIndex = -1;
      return;
    }

    alertDialog = BootstrapDialog.show({
      type: BootstrapDialog.TYPE_INFO,
      title: alertStack[alertIndex].title,
      message: alertStack[alertIndex].message,
      onhidden: function() {
        alertDialog = null;
        var data = alertStack[alertIndex];
        if (data.resolve) {
          data.resolve();
        }
        showNextAlert();
      },
      buttons: [{
        label: 'OK',
        action: function(ref) {
          ref.close();
        }
      }]
    });
  };

  DialogManager.alertRequested.add(function(message, title, resolve) {
    if (!message) {
      return;
    }

    alertStack.push({ title: title, message: message, resolve: resolve });
    showNextAlert();
  });

  var showNextConfirm = function() {
    if (confirmDialog) {
      return;
    }

    confirmIndex++;

    if (confirmIndex === confirmStack.length) {
      confirmStack = [];
      confirmIndex = -1;
      return;
    }

    confirmDialog = BootstrapDialog.show({
      type: BootstrapDialog.TYPE_WARNING,
      title: 'Пожалуйста, подтвердите',
      message: confirmStack[confirmIndex].message,
      closable: false,
      onhidden: function() {
        confirmDialog = null;
        showNextConfirm();
      },
      buttons: [{
        label: 'Подтвердить',
        action: function(ref) {
          ref.close();
          var data = confirmStack[confirmIndex];
          if (data.resolve) {
            data.resolve();
          }
        }
      }, {
        label: 'Отмена',
        action: function(ref) {
          ref.close();
          var data = confirmStack[confirmIndex];
          if (data.reject) {
            data.reject();
          }
        }
      }]
    });
  };

  DialogManager.confirmRequested.add(function(message, resolve, reject) {
    confirmStack.push({ message: message, resolve: resolve, reject: reject });
    showNextConfirm();
  });

  DialogManager.jobStarted.add(function() {
    if (busyDialog) {
      return;
    }

    if (document.activeElement !== document.body) {
      document.activeElement.blur();
    }

    busyDialog = BootstrapDialog.show({
      type: BootstrapDialog.TYPE_INFO,
      title: 'Идет загрузка...',
      message: $('<div class="progress progress-striped active">' +
                 '<div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%" />' +
                 '</div>'),
      closable: false
    });
  });

  DialogManager.jobEnded.add(function() {
    if (!busyDialog) {
      return;
    }

    busyDialog.close();
    busyDialog = null;
  });
}]);
