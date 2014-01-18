/**
 * Resources services.
 */
var dvdCatServices = angular.module('dvdCatServices', ['ngResource']);

dvdCatServices.constant('GenresConstant', {
    action: 'Action',
    adventure: 'Aventure',
    animation: 'Animation',
    comedy: 'Comédie',
    crime: 'Crime',
    disaster: 'Catastrophique',
    documentary: 'Documentaire',
    drama: 'Drame',
    erotic: 'Erotique',
    family: 'Famille',
    fantastic: 'Fantastique',
    martialArts: 'Arts Martiaux',
    horror: 'Horreur',
    musical: 'Musical',
    romance: 'Romantique',
    scienceFiction: 'Science fiction',
    thriller: 'Thriller',
    war: 'Guerre',
    western: 'Western'
});

/**
 * This service permit to create a RESTful client and avoid the $http lower method. The $ressource route must hve the same name in "app.js".
 */
dvdCatServices.factory('Dvd', ['$resource',
    function ($resource) {
        return {
            DvdList: $resource('', {}, {
                getAllDvd: {method: 'GET', url: 'getAllDvd/'},
                deleteDvd: {method: 'POST', url: '/dvd/deleteDvd'}
            }),
            DvdAdd: $resource('', {}, {
                saveDvd: {method: 'POST', url: 'addDvd/saveDvd'},
                saveImage: {method: 'POST', url: 'addDvd/saveImage'},
                renameImage: {method: 'POST', url: 'addDvd/renameImage'},
                isDvdExist: {method: 'GET', url: 'isDvdExist/:dvd'}
            }),
            DvdDetails: $resource('', {}, {
                getDvd: {method: 'GET', url: 'getDvd/:dvd'},
                editDvd: {method: 'POST', url: '/dvd/editDvd'}
            })
        }
    }]
);

/**
* This service permit to execute a JSONP requests to get JSON data.
*/
dvdCatServices.factory('MovieDB', ['$resource',
    function ($resource) {
        return {
            GetMovieID: $resource('https://api.themoviedb.org/3/search/movie?api_key=:apiKeyVar&query=:queryVar&language=:languageVar&callback=JSON_CALLBACK', {}, {
                request: {method: 'JSONP'}
            }),
            GetMovieDetails: $resource('https://api.themoviedb.org/3/movie/:queryVar?api_key=:apiKeyVar&language=:languageVar&callback=JSON_CALLBACK', {}, {
                request: {method: 'JSONP'}
            }),
            GetMovieCast: $resource('https://api.themoviedb.org/3/movie/:queryVar/credits?api_key=:apiKeyVar&language=:languageVar&callback=JSON_CALLBACK', {}, {
                request: {method: 'JSONP'}
            })
        }
    }]
);


/* DEPRECATED METHODS */
///**
// * This service permit to execute a JSONP requests to get JSON data.
// */
//dvdCatServices.factory( 'MovieDB', ['$resource', function( $resource )
//{
//    return $resource( 'https://api.themoviedb.org/3/search/movie?api_key=:apiKeyVar&query=:queryVar&language=fr&callback=JSON_CALLBACK', {}, {
//            request: {method: 'JSONP'}
//        }
//    );
//}] );

///**
//* This service permit to execute a JSONP request to get JSON data with $http service.
//*/
//dvdCatServices.factory('MovieDB', ['$http',
//    function ($http) {
//        return {
//            getMovieData: function (url) {
//                $http.jsonp(url, successCallback).
//                    success(function (data, status, headers, config) {
//                        // This callback will be called asynchronously when the response is available
//                        console.log('Response');
//                        console.log(data.results[0]);
//                        successCallback(data);
//                    }).
//                    error(function (data, status, headers, config) {
//                        // Called asynchronously if an error occurs or server returns response with an error status.
//                        console.log('Error');
//                        console.log(data);
//                    });
//            }
//        };
//    }]
//);

///**
// * Execute a JSONP request to get movie information from internet. (THIS CODE GO IN THE CONTROLLER)
// * @param url: The requested url
// * @param movieDetails: The variable where the request result is set
// * example: var url = $scope.requests.movieID.replace('VAR_API_KEY', $scope.requests.movieDBKey).replace('VAR_QUERY', $scope.dvd.name).replace('VAR_LANGUAGE', 'fr');
// *          $scope.getMovieInformation(url, $scope.dvd);
// */
//$scope.getMovieInformation = function (url) {
//    $http.jsonp(url).
//        success(function (data, status, headers, config) {
//            // This callback will be called asynchronously when the response is available
//            console.log(data);
//            if(data.results.length > 0) {
//                console.log('Movie got from internet');
//                console.log(data);
//                $scope.dvd.searchError = false;
//                $scope.dynamicPopover = 'Le film à été trouvé';
//
//                // Set the movie poster url.
//                $scope.moviePoster = $scope.requests.images.replace('VAR_QUERY', data.results[0].poster_path);
//            }
//
//            else {
//                console.log('The movie is not listed');
//                $scope.dvd.searchError = true;
//                $scope.dynamicPopover = 'Le film n\'est pas répertorié';
//            }
//        }).
//        error(function (data, status, headers, config) {
//            // Called asynchronously if an error occurs or server returns response with an error status.
//            console.log('Error when getting the data from internet');
//        });
//};

///**
// * This service permit to manage the DVD queries. (DEPRECATED)
// */
//dvdCatServices.factory('Dvd', ['$resource',
//    function ($resource) {
//        return $resource('addDvd/', {}, {
//            saveDvd: {method: 'POST', url: 'addDvd/save'},
//            getAllDvd: {method: 'GET', url: 'getAllDvd/'},
//            getDvd: {method: 'GET', url: 'getDvd/:dvd'}
//        });
//    }]
//);