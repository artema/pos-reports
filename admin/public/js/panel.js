angular
.module('PosReportsPanel', [
	'ngRoute',
	'ngResource',
	'angularModalService',
	'angularFileUpload',
	'PosReports.controllers',
	'PosReports.directives',
	'PosReports.filters',
	'PosReports.services'
])
.config(($routeProvider) => {
	$routeProvider.when('/', { templateUrl: '/public/partials/home.html', controller: 'HomeController' });

	$routeProvider.otherwise({ redirectTo: '/' });
});
