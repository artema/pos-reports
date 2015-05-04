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

	$routeProvider.when('/customers', { templateUrl: '/public/partials/customers.html', controller: 'CustomersController' });
	$routeProvider.when('/items', { templateUrl: '/public/partials/items.html', controller: 'ItemsController' });
	$routeProvider.when('/sales', { templateUrl: '/public/partials/sales.html', controller: 'SalesController' });
	$routeProvider.when('/staff', { templateUrl: '/public/partials/staff.html', controller: 'StaffController' });

	$routeProvider.otherwise({ redirectTo: '/' });
});
