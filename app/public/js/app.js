/**
 * Dependencies modules.
 * @type {*|module}
 */
var phonecatApp = angular.module('phonecatApp', [
    'ngRoute',
    'phonecatControllers',
    'phonecatFilters',
    'phonecatServices',
    'phonecatAnimations'
]);

/**
 * Routes handler.
 */
phonecatApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/phones', {           // When index.html is loaded, we display the new template url
                templateUrl: 'views/phone-list.html',
                controller: 'PhoneListCtrl'
            }).
            when('/phones/:phoneId', {
                templateUrl: 'views/phone-detail.html',
                controller: 'PhoneDetailCtrl'
            }).
            when('/addPhone', {
                templateUrl: 'views/phone-add.html',
                controller: 'PhoneAddCtrl'
            }).
            otherwise({
                redirectTo: '/phones'   // The name which appear when loading index.html
            });
    }
]);