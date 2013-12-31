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

phonecatServices.factory('Allocine', ['$http',
    function ($http, $q) {
        return {
            getPage: function (page) {
                //var deferred = $q.defer();

//            $http.get(page).then(function(response) {
//                console.log('response');
//                console.log(response.data);
//                //deferred.resolve(response.data);
//            });

//                $http.jsonp('http://www.allocine.fr/recherche/?q=avatar').
//                    success(function(data, status, headers, config) {
//                console.log('response');
//                console.log(data);
//                    }).
//                    error(function(data, status, headers, config) {
//                        console.log('error');
//                        console.log(status);
//                    });

                /*var url = "http://www.omdbapi.com/?t=Avatar"; //"https://api.themoviedb.org/3/movie/550?api_key=37c2294ca3753bd14d165eda4b3f9314";
                $http.jsonp(url).then(function (response) {
                    console.log('response');
                    //var json = mapDOM(response.data, true);
                    //console.log(json);
                    //console.log(response.data);
                });*/

                var url = "https://api.themoviedb.org/3/movie/550?api_key=37c2294ca3753bd14d165eda4b3f9314&language=fr&callback=JSON_CALLBACK";
                $http.jsonp(url).
                    success(function(data, status, headers, config) {
                        // This callback will be called asynchronously when the response is available
                        console.log('response');
                        console.log(data);
                    }).
                    error(function(data, status, headers, config) {
                        // Called asynchronously if an error occurs or server returns response with an error status.
                        console.log('error');
                        console.log(data);
                    });

                /*$http({method: 'jsonp', url: "https://api.themoviedb.org/3/movie/550?api_key=37c2294ca3753bd14d165eda4b3f9314"}).
                    success(function(data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available
                        console.log('response');
                        console.log(data);
                    }).
                    error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        console.log('error');
                        console.log(data);
                    });*/

                /*var client = new XMLHttpRequest()
                client.open("GET", "http://www.themoviedb.org/search?query=avatar")
                client.onreadystatechange = function(data) {
                    console.log('response');
                    console.log(data);
                }
                client.send();*/

                /*$.ajax({
                        type: "GET",
                        url: "http://www.themoviedb.org/search?query=avatar",
                    crossDomain: true,
                    //data: { ... },
                    dataType: "json",

                    error: function (xhr, status, error) {
                        console.log('error');
                    },
                    success: function (json) {
                        console.log('response');
                    }});*/

                return null;//deferred.promise;
            }
        };
    }]
);