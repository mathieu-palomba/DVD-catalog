/**
 * Dependencies modules.
 * @type {*|module}
 */
var dvdsCatApp = angular.module('dvdsCatApp', [
    'ngRoute',
    'phonecatControllers',
    'phonecatFilters',
    'phonecatServices',
    'phonecatAnimations'
]);

/**
 * Routes handler.
 */
dvdsCatApp.config(['$routeProvider',
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