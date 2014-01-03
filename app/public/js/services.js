/**
 * Resources services.
 */
var dvdCatServices = angular.module('dvdCatServices', ['ngResource']);

/**
 * This service permit to create a RESTful client and avoid the $http lower method.
 */
dvdCatServices.factory('Dvd', ['$resource',
    function ($resource) {
        return {
            DvdList: $resource('phones/:dvdId.json', {}, {
                query: {method: 'GET', params: {dvdId: 'phones'}, isArray: true}
            }),
            DvdAdd: $resource('', {}, {
                saveDvd: {method: 'POST', url: 'addDvd/save'},
                getDvd: {method: 'GET', url: 'getDvd/:dvd'},
                getAllDvd: {method: 'GET', url: 'getAllDvd/'}
            })
        }
    }]
);

/**
 * This service permit to execute a JSONP request to get JSON data.
 */
dvdCatServices.factory('GetMovieData', ['$http',
    function ($http) {
        return {
            getData: function (url) {
                $http.jsonp(url).
                    success(function (data, status, headers, config) {
                        // This callback will be called asynchronously when the response is available
                        console.log('Response');
                        console.log(data);
                    }).
                    error(function (data, status, headers, config) {
                        // Called asynchronously if an error occurs or server returns response with an error status.
                        console.log('Error');
                        console.log(data);
                    });
            }
        };
    }]
);

/**
 * This service permit to manage the DVD queries. (DEPRECATED)
 */
//dvdCatServices.factory('Dvd', ['$resource',
//    function ($resource) {
//        return $resource('addDvd/', {}, {
//            saveDvd: {method: 'POST', url: 'addDvd/save'},
//            getAllDvd: {method: 'GET', url: 'getAllDvd/'},
//            getDvd: {method: 'GET', url: 'getDvd/:dvd'}
//        });
//    }]
//);