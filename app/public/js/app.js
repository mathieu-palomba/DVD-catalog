/**
 * Dependencies modules.
 * @type {*|module}
 */
var dvdCatApp = angular.module('dvdCatApp', [
    'ngRoute',
    'dvdListControllers',
    'dvdAddControllers',
    'dvdDetailsControllers',
    'dvdEditControllers',
    'userAccountControllers',
    'userAdministrationControllers',
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
            when('/dvd-list/:userName?', {           // When index.html is loaded, we display the new template url
                templateUrl: 'views/dvd-list.html',
                controller: 'DvdListCtrl'
            }).
            when('/dvd/:dvdTitle', {
                templateUrl: 'views/dvd-detail.html',
                controller: 'DvdDetailsCtrl'
            }).
            when('/addDvd', {
                templateUrl: 'views/dvd-add.html',
                controller: 'DvdAddCtrl'
            }).
            when('/editDvd/:dvdTitle', {
                templateUrl: 'views/dvd-edit.html',
                controller: 'DvdEditCtrl'
            }).
            when('/user/account', {
                templateUrl: 'views/user-account.html',
                controller: 'UserAccountCtrl'
            }).
            when('/user/administration', {
                templateUrl: 'views/users-administration.html',
                controller: 'UserAdministrationCtrl'
            }).
            otherwise({
                redirectTo: '/dvd-list'   // The name which appear when loading index.html
            });
    }
]);