/**
 * Resources services.
 */
var phonecatServices = angular.module('phonecatServices', ['ngResource']);

/**
 * This service permit to create a RESTful client and avoid the $http lower method.
 */
phonecatServices.factory('Phone', ['$resource',
    function ($resource) {
        return $resource('phones/:phoneId.json', {}, {
            query: {method: 'GET', params: {phoneId: 'phones'}, isArray: true}
        });
    }]
);

phonecatServices.factory('GetMovieData', ['$http',
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

                return null;
            }
        };
    }]
);