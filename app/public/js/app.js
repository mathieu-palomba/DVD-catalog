/**
 * Dependencies modules.
 * @type {*|module}
 */
var dvdCatApp = angular.module('dvdCatApp', [
    'ngRoute',
    'dvdCatControllers',
    'dvdCatFilter',
    'dvdCatServices',
    'dvdCatAnimations'
]);

/**
 * Routes handler.
 */
dvdCatApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/dvd', {           // When index.html is loaded, we display the new template url
                templateUrl: 'views/dvd-list.html',
                controller: 'DvdListCtrl'
            }).
            when('/dvd/:dvdId', {
                templateUrl: 'views/dvd-detail.html',
                controller: 'PhoneDetailCtrl'
            }).
            when('/addDvd', {
                templateUrl: 'views/dvd-add.html',
                controller: 'PhoneAddCtrl'
            }).
            otherwise({
                redirectTo: '/dvd'   // The name which appear when loading index.html
            });
    }
]);