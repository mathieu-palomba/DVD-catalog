/**
 * Resources services.
 */
var dvdCatServices = angular.module('dvdCatServices', ['ngResource']);

/**
 * This service permit to create a RESTful client and avoid the $http lower method.
 */
dvdCatServices.factory('Phone', ['$resource',
    function ($resource) {
        return $resource('phones/:phoneId.json', {}, {
            query: {method: 'GET', params: {phoneId: 'phones'}, isArray: true}
        });
    }]
);

/**
 * This service permit to manage the DVD queries.
 */
dvdCatServices.factory('Dvd', ['$resource',
    function ($resource) {
        return $resource('addDvd/', {}, {
            saveDvd: {method: 'POST', url: 'addDvd/save'},
            getAllDvd: {method: 'GET', url: 'getAllDvd/'},
            getDvd: {method: 'GET', url: 'getDvd/:dvd'}
        });
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