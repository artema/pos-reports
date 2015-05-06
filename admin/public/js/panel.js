angular
.module('PosReportsPanel', [
	'ngRoute',
	'ngResource',
	'angularModalService',
	'PosReports.controllers',
	'PosReports.directives',
	'PosReports.filters',
	'PosReports.services'
])
.config(($routeProvider) => {
	$routeProvider.when('/', { templateUrl: '/public/partials/home.html', controller: 'HomeController' });

	$routeProvider.when('/customers', { templateUrl: '/public/partials/customers.html', controller: 'CustomersController' });
	$routeProvider.when('/items', { templateUrl: '/public/partials/items.html', controller: 'ItemsController' });
	$routeProvider.when('/mapping', { templateUrl: '/public/partials/mapping.html', controller: 'MappingController' });
	$routeProvider.when('/profile', { templateUrl: '/public/partials/profile.html', controller: 'ProfileController' });
	$routeProvider.when('/sales', { templateUrl: '/public/partials/sales.html', controller: 'SalesController' });
	$routeProvider.when('/signup', { templateUrl: '/public/partials/signup.html', controller: 'SignupController' });
	$routeProvider.when('/staff', { templateUrl: '/public/partials/staff.html', controller: 'StaffController' });

	$routeProvider.otherwise({ redirectTo: '/' });
});
