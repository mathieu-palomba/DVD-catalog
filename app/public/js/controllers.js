/**
 * Controllers.
 */
var dvdCatControllers = angular.module('dvdCatControllers', ['ui.bootstrap']);

/**
 * DVD List controllers.
 */
dvdCatControllers.controller('DvdListCtrl', ['$scope', '$location', 'Dvd',
    function ($scope, $location, Dvd) {
        console.log('Dvd List controller');

        // Method with our service
        $scope.dvdList = Dvd.DvdList.query();

        // This value must have the same name in the html view to set the default filter
        $scope.orderProp = 'age';

        /**
         * Redirection into the add DVD html page.
         */
        $scope.addDvd = function () {
            $location.url('/addDvd');
        };
    }
]);

/**
 * DVD Details controllers.
 */
dvdCatControllers.controller('DvdDetailCtrl', ['$scope', '$routeParams', 'Dvd',
    function ($scope, $routeParams, Dvd) {
        console.log('Dvd Details controller');

        // Method with our service
        $scope.dvd = Dvd.DvdList.get({dvdId: $routeParams.dvdId}, function (dvd) {
            $scope.mainImageUrl = dvd.images[0];
        });

        $scope.setImage = function (imageUrl) {
            $scope.mainImageUrl = imageUrl;
        }
    }
]);

/**
 * Add DVD controllers.
 */
dvdCatControllers.controller('DvdAddCtrl', ['$scope', '$location', '$http', 'Dvd', 'MovieDB',
    function ($scope, $location, $http, Dvd, MovieDB) {
        console.log('Dvd Add controller');



        // The different movie genres.
        $scope.genres = {
            action: 'Action',
            adventure: 'Aventure',
            animation: 'Animation',
            comedy: 'Comedie',
            crime: 'Policier',
            disaster: 'Catastrophique',
            documentary: 'Documentaire',
            drama: 'Dramatique',
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
        };

        // Initialize the DVD form.
        $scope.dvd = {
            searchError: false,
            title: '',
            genre: $scope.genres.action,
            releaseDate: '',
            overview: '',
            productionCompanies: '',
            director: '',
            actors: [ {name: ''}]
        };

        // Initialize the dynamic popover when the user search a movie not recorder in the movieDB.
        $scope.dynamicPopoverStatus = {
            error: 'Le film n\'est pas répertorié',
            success: 'Le film à été trouvé'
        };
        $scope.dynamicPopoverPlacement = 'right';
        $scope.dynamicPopoverTrigger = 'focus';

        /**
         * Redirection into the index html page.
         */
        $scope.cancelAddDvd = function () {
            $location.url('/dvd');
        };

        /**
         * Add a new Actor.
         */
        $scope.addInputActor = function(actor){
            // The boolean which permit to check if an empty field exist
            var isExist = false;

            // We check if an empty field alreayd exist
            for (var actorID in $scope.dvd.actors) {
                if($scope.dvd.actors[actorID].name == '')
                    isExist = true;
            }

            // If no field are empty, we add a new input field
            if(!isExist) {
                $scope.dvd.actors.push( {name: ''} );
            }
        }

        /**
         * Delete the current Actor.
         * @param actor: The actor to delete
         */
        $scope.deleteThisActor = function(actor){
            // We decrement the length for the ng-repeat, and we delete the actor value
            $scope.dvd.actors.length -= 1;
            delete $scope.dvd.actors[actor];
        };

        /**
         * Get the movie information to fill out the DVD structure.
         */
        $scope.checkMovieInformation = function () {
            console.log('Checking movie data: ' + $scope.dvd.title);

            // We get the movie ID
            var dvdID = MovieDB.GetMovieID.request({ apiKeyVar: $scope.requests.movieDBKey, queryVar: $scope.dvd.title, languageVar: 'fr' },
                function success() {
                    // This callback will be called asynchronously when the response is available
                    if(dvdID.results.length > 0) {
                        console.log('Movie ID got from internet');
                        console.log(dvdID);

                        // We set the popover message and the class button OK
                        $scope.dvd.searchError = false;
                        $scope.dynamicPopover = $scope.dynamicPopoverStatus.success;

                        // Set the movie poster url and the movie title.
                        $scope.dvd.title = dvdID.results[0].title;
                        if(dvdID.results[0].poster_path != undefined && dvdID.results[0].poster_path != null) {
                            $scope.moviePoster = $scope.requests.images.replace('VAR_QUERY', dvdID.results[0].poster_path);
                        }

                        // If an ID is founded, we can get the movie details
                        var dvdDetails = MovieDB.GetMovieDetails.request({ queryVar: dvdID.results[0].id, apiKeyVar: $scope.requests.movieDBKey, languageVar: 'fr' },
                            function success() {
                                // This callback will be called asynchronously when the response is available
                                console.log('Movie details got from internet');
                                console.log(dvdDetails);

                                // We fill out the movies form
                                $scope.dvd.genre = dvdDetails.genres[0].name;
                                console.log($scope.dvd.genre);
                                $scope.dvd.releaseDate = dvdDetails.release_date;
                                $scope.dvd.overview = dvdDetails.overview;
                                $scope.dvd.productionCompanies = '';

                                for (var productionCompanyID in dvdDetails.production_companies) {
                                    $scope.dvd.productionCompanies += dvdDetails.production_companies[productionCompanyID].name + ', ';
                                }
                            },
                            function err() {
                                // Called asynchronously if an error occurs or server returns response with an error status.
                                console.log('Error when getting the movie details from internet');
                            });

                        // If an ID is founded, we can get the movie cast
                        var dvdCast = MovieDB.GetMovieCast.request({ queryVar: dvdID.results[0].id, apiKeyVar: $scope.requests.movieDBKey, languageVar: 'fr' },
                            function success() {
                                // This callback will be called asynchronously when the response is available
                                console.log('Movie cast got from internet');
                                console.log(dvdCast);

                                // We fill out the movies form
                                $scope.dvd.director = dvdCast.crew[0].name;
                                $scope.dvd.actors = [];

                                // If the list isn't empty
                                if(dvdCast.cast.length > 0) {
                                    for (var i = 0; i < 5; i++) {
//                                        $scope.dvd.actors += dvdCast.cast[i].name + ', ';
                                        $scope.dvd.actors.push( {name: dvdCast.cast[i].name} );
                                    }
                                }
                            },
                            function err() {
                                // Called asynchronously if an error occurs or server returns response with an error status.
                                console.log('Error when getting the movie cast from internet');
                            });
                    }

                    else {
                        console.log('The movie ID is not listed');

                        // We set the popover message and the class button error
                        $scope.dvd.searchError = true;
                        $scope.dynamicPopover = $scope.dynamicPopoverStatus.error;
                    }
                },
                function err() {
                    // Called asynchronously if an error occurs or server returns response with an error status.
                    console.log('Error when getting the movie ID from internet');

                    // We set the popover message and the class button error
                    $scope.dvd.searchError = true;
                    $scope.dynamicPopover = $scope.dynamicPopoverStatus.error;
                });
        };

        /**
         * Save the new DVD in the database.
         */
        $scope.performSave = function () {
            // We check if a DVD already exist in the database
            var check = Dvd.DvdAdd.isDvdExist({dvd: 'Avatar'}, function () {
                if (check.success) {
                    console.log('DVD already exist');
                }
                else {
                    // We save the DVD in the database
                    var dvd = Dvd.DvdAdd.saveDvd({dvd: $scope.dvd}, function () {
                        if (dvd.success) {
                            console.log('DVD added successfully');
                            $location.url('/dvd');
                        }
                        else {
                            console.log("Error when added the DVD");
                        }
                    });
                }
            });
        };

//        var dvdList = Dvd.DvdAdd.getAllDvd( function()
//        {
//            if( dvdList.success )
//            {
//                console.log('DVD got successfully');
//                console.log(dvdList.dvdList);
//                //$location.url('/dvd');
//            }
//            else
//            {
//                console.log('Error when getting the DVD list');
//            }
//        } );

//        var dvd = Dvd.DvdAdd.getDvd( {dvd: 'Avatar'}, function()
//        {
//            if( dvd.success )
//            {
//                console.log('DVD got successfully');
//                console.log(dvd.dvd[0]);
//                //$location.url('/dvd');
//            }
//            else
//            {
//                console.log("Error when getting the DVD");
//            }
//        } );

//        var dvd = Dvd.DvdAdd.isDvdExist({dvd: 'Avatar'}, function () {
//            if (dvd.success) {
//                console.log('DVD exist');
//            }
//            else {
//                console.log('Error when checking the DVD');
//            }
//        });

        // To display image canvas
//        var canvas = document.getElementById('imageCanvas');
//        var context = canvas.getContext('2d');
//        var imageObj = new Image();
//
//        imageObj.onload = function() {
//            context.drawImage(imageObj, 0, 0);
//            context.lineWidth = 2;
//            context.strokeStyle = "black";
//            context.strokeRect(0, 0, 500, 500);
//        };
//        imageObj.src = 'http://image.tmdb.org/t/p/w500/nzN40Eck9q6YbdaNQs4pZbMKsfP.jpg';

    }]
)
;