/**
 * Underscore service.
 * @type {*|module}
 */
var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
    return window._;    // Assumes underscore has already been loaded on the page
});

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
    disaster: 'Catastrophe',
    documentary: 'Documentaire',
    drama: 'Drame',
    erotic: 'Erotique',
    eastern: 'Oriental',
    family: 'Familial',
    fantastic: 'Fantastique',
    fantasy: 'Fantaisie',
    foreign: 'Étranger',
    martialArts: 'Arts Martiaux',
    history: 'Histoire',
    horror: 'Horreur',
    indie: 'Indie',
    mystery: 'Mystère',
    music: 'Musique',
    musical: 'Musical',
    romance: 'Romance',
    scienceFiction: 'Science-Fiction',
    sport: 'Sport',
    suspense: 'Suspense',
    thriller: 'Thriller',
    war: 'Guerre',
    western: 'Western'
});

/**
 * The DVD genres.
 */
dvdCatServices.constant('DvdFormatsConstant', {
    dvd: 'Dvd',
    blueray: 'Blue-ray',
    divx: 'Divx',
    dvdrip: 'Dvd-Rip'
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
            var hashCode = Math.abs(moviePosterName.hashCode());
            return hashCode + '.jpg';
        }
    };
});

/**
 * This services permit to update the background image.
 */
dvdCatServices.factory('Preferences', function () {
    return {
        updateBackground: function (backgroundPath) {
            // Update background in CSS
            var body = document.body;
            body.style.background = 'url(' + backgroundPath + ') repeat';
        }
    };
});

/**
 * Add or delete a field in the "add" and "edit" view.
 */
dvdCatServices.factory('MultiField', function () {
    return {
        addInputField: function (fields, field) {
            // The boolean which permit to check if an empty field exist
            var isExist = false;

            // We check if an empty field already exist
            for (var fieldID in fields) {
                if (fields[fieldID].name == '') {
                    isExist = true;
                }
            }

            // If no field are empty, we add a new input field
            if (!isExist) {
                console.log('Add field');
                fields.push({name: field});
            }
        },

        deleteThisField: function(fields, field){
            console.log('Delete actor');
            // We decrement the length for the ng-repeat, and we delete the field value
//            $scope.dvd.actors.length -= 1;
//            delete $scope.dvd.actors[actor];
            fields.splice(field, 1);
        }
    };
});


/**
 * Array service.
 */
dvdCatServices.factory('Array', function () {
    return {
        inArray: function(array, id) {
            for(var i=0;i<array.length;i++) {
                if(array[i].name == id) {
                    return true;
                }
            }
            return false;
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

dvdCatServices.factory('Cache', function($cacheFactory) {
    return $cacheFactory('dvd_list_cache');
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
            }),
            DvdAdd: $resource('', {}, {
                saveDvd: {method: 'POST', url: '/addDvd/saveDvd'},
                saveImage: {method: 'POST', url: '/addDvd/saveImage'},
                renameImage: {method: 'POST', url: '/addDvd/renameImage'},
                isDvdExist: {method: 'GET', url: '/isDvdExist/:dvdTitle&:releaseDate'}
            }),
            DvdDetails: $resource('', {}, {
                getDvd: {method: 'GET', url: '/getDvd/:dvdID&:userName'},
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
                getOwner: {method: 'GET', url: '/owner/:userName'},
                deleteCurrentOwner: {method: 'POST', url: '/owner/deleteCurrentOwner'},
                deleteCurrentUser: {method: 'POST', url: '/deleteCurrentUser'},
                updateCurrentOwner: {method: 'POST', url: '/updateCurrentOwner'},
                updateCurrentUser: {method: 'POST', url: '/updateCurrentUser'},
                updateCurrentUserPreferences: {method: 'POST', url: '/updateCurrentUserPreferences'},
                logout: {method: 'GET', url: '/user/logout'}
            }),
            Administration: $resource('', {}, {
                getOwners: {method: 'GET', url: '/owners'},
                getUsers: {method: 'GET', url: '/user/users'},
                deleteOwner: {method: 'POST', url: '/owner/deleteOwner'},
                deleteUser: {method: 'POST', url: '/deleteUser'},
                update: {method: 'POST', url: '/update'}
            })
        }
    }]
);

/**
 * This service permit to create a RESTful client and avoid the $http lower method. The $ressource route must hve the same name in "app.js".
 */
dvdCatServices.factory('Contact', ['$resource',
    function ($resource) {
        return $resource('', {}, {
            sendEmail: {method: 'POST', url: '/contact'}
        });
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
            }),
            GetMovieImagesPath: $resource('https://api.themoviedb.org/3/movie/:queryVar/images?api_key=:apiKeyVar&language=:languageVar&callback=JSON_CALLBACK', {}, {
                request: {method: 'JSONP'}
            }),
            GetPeopleID: $resource('https://api.themoviedb.org/3/search/person?api_key=:apiKeyVar&query=:queryVar&language=:languageVar&callback=JSON_CALLBACK', {}, {
                request: {method: 'JSONP'}
            }),
            GetPeopleDetails: $resource('https://api.themoviedb.org/3/person/:queryVar?api_key=:apiKeyVar&language=:languageVar&callback=JSON_CALLBACK', {}, {
                request: {method: 'JSONP'}
            }),
            GetPeopleImagesPath: $resource('https://api.themoviedb.org/3/person/:queryVar/images?api_key=:apiKeyVar&language=:languageVar&callback=JSON_CALLBACK', {}, {
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