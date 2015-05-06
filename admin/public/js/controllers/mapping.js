angular.module('PosReports.controllers')
.controller('MappingController',
  ['$scope', '$timeout', 'DialogManager', 'MappingModel',
  ($scope, $timeout, DialogManager, MappingModel) => {

  if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
    DialogManager.alert('Ваш браузер не поддерживает загрузку файлов.');
    return;
  }

  function updateStats() {
    $timeout(() => {
      $scope.locationCount = MappingModel.locationCount;
      $scope.staffCount = MappingModel.staffCount;
      $scope.itemCount = MappingModel.itemCount;
      $scope.customerCount = MappingModel.customerCount;
    });
  }

  updateStats();
  MappingModel.changed.add(updateStats);

  $scope.reset = () => {
    DialogManager.confirm('Вы действительно хотите удалить все загруженные данные?')
      .then(() => MappingModel.reset());
  };

  function handler(form, method, columns) {
    return (e) => {
      let file = e.target.files[0],
          reader = new FileReader();

      if (file) {
        reader.onloadend = (e => {
          let csv = Papa.parse(e.target.result);
          let data = csv.data.map(row => columns.reduce((item, column, i) => {
            item[column] = row[i];
            return item;
          }, {}));

          MappingModel[method](data);
          document.getElementById(form).reset();
          reader = null;
        });
        reader.readAsText(file);
      }
    };
  }

  document
    .getElementById('mappings-input-locations')
    .addEventListener('change', handler('mappings-form-locations', 'setLocations', ['id', 'name']), false);

  document
    .getElementById('mappings-input-staff')
    .addEventListener('change', handler('mappings-form-staff', 'setStaff', ['id', 'firstName', 'lastName']), false);

  document
    .getElementById('mappings-input-items')
    .addEventListener('change', handler('mappings-form-items', 'setItems', ['id', 'name']), false);

  document
    .getElementById('mappings-input-customers')
    .addEventListener('change', handler('mappings-form-customers', 'setCustomers', ['id', 'firstName', 'lastName']), false);
}]);
