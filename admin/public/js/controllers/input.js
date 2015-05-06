angular.module('PosReports.controllers')
.controller('InputController',
  ['$scope', '$timeout', 'DialogManager', 'ReportModel',
  ($scope, $timeout, DialogManager, ReportModel) => {

  if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
    DialogManager.alert('Ваш браузер не поддерживает загрузку файлов.');
    return;
  }

  function handler(form) {
    const columns = [
      'time',
      'location',
      'check',
      'staff',
      'customer',
      'item',
      'price'
    ];

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

          document.getElementById(form).reset();
          reader = null;

          var job = DialogManager.startJob();

          ReportModel.uploadData({ sales: data }).then(() => {
            DialogManager.endJob(job);
            DialogManager.alert('Данные успешно загружены.');
          }, e => {
            DialogManager.endJob(job);
            DialogManager.alert(e.data.message || 'Не удалось загрузить данные.');
          });
        });
        reader.readAsText(file);
      }
    };
  }

  document
    .getElementById('datainput-upload')
    .addEventListener('change', handler('datainput-form'), false);
}]);
