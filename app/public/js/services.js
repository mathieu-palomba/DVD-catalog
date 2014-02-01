/**
 * Resources services.
 */
var dvdCatServices = angular.module('dvdCatServices', ['ngResource']);

/**
 * The movie genres.
 */
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
 * This services permit to generate jpg ID with string name.
 */
dvdCatServices.factory('IdGenerator', function () {
    return {
        moviePosterID: function (moviePosterName) {
            // Hashcode method to generate moviePoster name
            String.prototype.hashCode = function () {
                var hash = 0;
                if (this.length == 0) return hash;
                for (i = 0; i < this.length; i++) {
                    char = this.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash; // Convert to 32bit integer
                }
                return hash;
            };

            //var ID = function () {
//    // Math.random should be unique because of its seeding algorithm.
//    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
//    // after the decimal.
//    return '_' + Math.random().toString(36).substr(2, 9);
//};
            // We return the movie poster ID
            return Math.abs(moviePosterName.hashCode()) + '.jpg';
        }
    };
});

/**
 * Add or delete an Actor in the "add" and "edit" view.
 */
dvdCatServices.factory('Actors', function () {
    return {
        addInputActor: function ($scope) {
            // The boolean which permit to check if an empty field exist
            var isExist = false;

            // We check if an empty field already exist
            for (var actorID in $scope.dvd.actors) {
                if ($scope.dvd.actors[actorID].name == '')
                    isExist = true;
            }

            // If no field are empty, we add a new input field
            if (!isExist) {
                console.log('Add actor');
                $scope.dvd.actors.push({name: ''});
            }
        },

        deleteThisActor: function($scope, actor){
            console.log('Delete actor');
            // We decrement the length for the ng-repeat, and we delete the actor value
//            $scope.dvd.actors.length -= 1;
//            delete $scope.dvd.actors[actor];
            $scope.dvd.actors.splice(actor, 1);
        }
    };
});

/**
 * Rating service.
 */
dvdCatServices.factory('Rating', function () {
    return {
        rate: 0,
        max: 5,
        readOnly: true,
        readWrite: false,
        hoveringOver: function ($scope, value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        }
    };
});

/**
 * This service permit to create a RESTful client and avoid the $http lower method. The $ressource route must hve the same name in "app.js".
 */
dvdCatServices.factory('Dvd', ['$resource',
    function ($resource) {
        return {
            DvdList: $resource('', {}, {
                getAllDvd: {method: 'GET', url: '/getAllDvd'},
                deleteDvd: {method: 'POST', url: '/dvd/deleteDvd'}
//                getCurrentUser: {method: 'GET', url: '/user/currentUser'},
//                getCurrentOwner: {method: 'GET', url: '/owner'}
            }),
            DvdAdd: $resource('', {}, {
                saveDvd: {method: 'POST', url: '/addDvd/saveDvd'},
                saveImage: {method: 'POST', url: '/addDvd/saveImage'},
                renameImage: {method: 'POST', url: '/addDvd/renameImage'},
                isDvdExist: {method: 'GET', url: '/isDvdExist/:dvdTitle'}
            }),
            DvdDetails: $resource('', {}, {
                getDvd: {method: 'GET', url: '/getDvd/:dvdTitle&:userName'},
                editDvd: {method: 'POST', url: '/dvd/editDvd'}
            })
        }
    }]
);

/**
 * This service permit to create a RESTful client and avoid the $http lower method. The $ressource route must hve the same name in "app.js".
 */
dvdCatServices.factory('User', ['$resource',
    function ($resource) {
        return {
            UserAccount: $resource('', {}, {
                getCurrentUser: {method: 'GET', url: '/user/currentUser'},
                getCurrentOwner: {method: 'GET', url: '/owner'},
                getOwner: {method: 'GET', url: '/owner/:userName'}
            }),
            Administration: $resource('', {}, {
                getOwners: {method: 'GET', url: '/owners'}
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