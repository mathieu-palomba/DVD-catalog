/**
 * Controllers.
 */
var dvdAddControllers = angular.module('dvdAddControllers', ['ui.bootstrap', 'ngRoute']);


/**
 * Add DVD controllers.
 */
dvdAddControllers.controller('DvdAddCtrl', ['$scope', '$location', '$http', 'Dvd', 'User', 'MovieDB', 'GenresConstant', 'IdGenerator', 'MultiField',
    function ($scope, $location, $http, Dvd, User, MovieDB, GenresConstant, IdGenerator, MultiField) {
        console.log('Dvd Add controller');



        // The different movie genres.
        $scope.genres = GenresConstant;

        // Initialize the DVD form.
        $scope.dvd = {
            searchError: false,
            temporaryMoviePosterName: 'temporaryImg.jpg',
            title: '',
            moviePoster: '',
            genre: $scope.genres.action,
            releaseDate: '',
            overview: '',
            productionCompanies: '',
            director: '',
            actors: [ {name: ''}]
        };

        // Initialize the dynamic popover when the user search a movie not recorder in the movieDB.
        $scope.dynamicFindPopoverStatus = {
            error: 'Le film n\'est pas répertorié',
            success: 'Le film à été trouvé'
        };
        $scope.dynamicFindPopover = $scope.dynamicFindPopoverStatus.success;
        $scope.dynamicFindPopoverPlacement = 'right';
        $scope.dynamicFindPopoverTrigger = 'focus';

        // Initialize the dynamic popover when the user save a movie already recorder in the database.
        $scope.dynamicSavePopoverStatus = {
            error: 'Le film est déjà répertorié',
            success: 'Le film a été sauvegardé',
            retry: 'Attendez un peu avant de cliquez s\'il vous plait'
        };
        $scope.dynamicSavePopover = $scope.dynamicSavePopoverStatus.success;
        $scope.dynamicSavePopoverPlacement = 'bottom';
        $scope.dynamicSavePopoverTrigger = 'focus';     // Primary it's "click"

        // We get the current owner
        $scope.owner = User.UserAccount.getCurrentOwner(function() {
            if($scope.owner.success) {
                console.log($scope.owner);
            }
        });

        /**
         * Redirection into the index html page.
         */
        $scope.cancelAddDvd = function () {
            $location.url('/dvd-list');
        };

        /**
         * Add a new genre.
         */
        $scope.addInputGenre = function() {
//            MultiField.addInputField($scope.dvd.actors);
        };

        /**
         * Delete the current genre.
         * @param actor: The genre to delete
         */
        $scope.deleteThisGenre = function(genre) {
//            MultiField.deleteThisField($scope.dvd.actors, actor);
        };

        /**
         * Add a new Actor.
         */
        $scope.addInputActor = function() {
            MultiField.addInputField($scope.dvd.actors);
        };

        /**
         * Delete the current Actor.
         * @param actor: The actor to delete
         */
        $scope.deleteThisActor = function(actor) {
            MultiField.deleteThisField($scope.dvd.actors, actor);
        };

        /**
         * Get the movie information to fill out the DVD structure.
         */
        $scope.checkMovieInformation = function () {
            console.log('Checking movie data: ' + $scope.dvd.title);

            // We get the movie ID
            var dvdID = MovieDB.GetMovieID.request({ 'apiKeyVar': $scope.requests.movieDBKey, 'queryVar': $scope.dvd.title, 'languageVar': 'fr' },
                function success() {
                    // This callback will be called asynchronously when the response is available
                    if(dvdID.results.length > 0) {
                        console.log('Movie ID got from internet');
                        console.log(dvdID);

                        // We set the popover message and the class button OK
                        $scope.dvd.searchError = false;
                        $scope.dynamicFindPopover = $scope.dynamicFindPopoverStatus.success;

                        // Set the movie poster url and the movie title.
                        $scope.dvd.title = dvdID.results[0].title;
                        if(dvdID.results[0].poster_path != undefined && dvdID.results[0].poster_path != null) {
                            $scope.dvd.moviePoster = 'img/' + IdGenerator.moviePosterID($scope.dvd.title);
                            $scope.moviePoster = $scope.requests.images.replace('VAR_QUERY', dvdID.results[0].poster_path);

                            // We pre-saved the movie poster to win time (avoid time problem when the user saved it's DVD and it's relocated in the "/dvd" route)
                            var saveImage = Dvd.DvdAdd.saveImage({uri: $scope.moviePoster, filename: $scope.dvd.temporaryMoviePosterName}, function () {
                                if (saveImage.success) {
                                    console.log('Image successfully saved');
                                }
                                else {
                                    console.log("Error when saved the image");
                                }
                            });
                        }

                        // If an ID is founded, we can get the movie details
                        var dvdDetails = MovieDB.GetMovieDetails.request({ 'queryVar': dvdID.results[0].id, 'apiKeyVar': $scope.requests.movieDBKey, 'languageVar': 'fr' },
                            function success() {
                                // This callback will be called asynchronously when the response is available
                                console.log('Movie details got from internet');
                                console.log(dvdDetails);

                                // We fill out the movies form
                                if(dvdDetails.genres.length > 0 ) {
                                    var genreExist = false;

                                    // We check if the genre exist in our list
                                    for(var genreID in $scope.genres) {
                                        if($scope.genres[genreID] == dvdDetails.genres[0].name) {
                                            genreExist = true;
                                        }
                                    }

                                    // If the genre exist, we display it, else we set '' to disable "save" button in "add-dvd" view
                                    genreExist ? $scope.dvd.genre = dvdDetails.genres[0].name : $scope.dvd.genre = '';
                                }

                                console.log($scope.dvd.genre);
                                $scope.dvd.releaseDate = dvdDetails.release_date;
                                $scope.dvd.overview = dvdDetails.overview;
                                $scope.dvd.productionCompanies = '';

                                for (var productionCompanyID in dvdDetails.production_companies) {
                                    // We compute the concat value ( '' to the last item, ', ' other)
                                    var concat = '';
                                    productionCompanyID == dvdDetails.production_companies.length-1 ? concat = '' : concat = ', ';

                                    $scope.dvd.productionCompanies += dvdDetails.production_companies[productionCompanyID].name + concat;
                                }
                            },
                            function err() {
                                // Called asynchronously if an error occurs or server returns response with an error status.
                                console.log('Error when getting the movie details from internet');
                            });

                        // If an ID is founded, we can get the movie cast
                        var dvdCast = MovieDB.GetMovieCast.request({ 'queryVar': dvdID.results[0].id, 'apiKeyVar': $scope.requests.movieDBKey, 'languageVar': 'fr' },
                            function success() {
                                // This callback will be called asynchronously when the response is available
                                console.log('Movie cast got from internet');
                                console.log(dvdCast);

                                // We fill out the movies form
                                if(dvdCast.crew.length > 0) {
                                    $scope.dvd.director = dvdCast.crew[0].name;
                                }
                                $scope.dvd.actors = [];

                                // If the list isn't empty
                                if(dvdCast.cast.length > 5) {
                                    for (var i = 0; i < 5; i++) {
//                                        $scope.dvd.actors += dvdCast.cast[i].name + ', ';
                                        $scope.dvd.actors.push( {name: dvdCast.cast[i].name + ' (' + dvdCast.cast[i].character + ')'} );
                                    }
                                }

                                else {
                                    for (var i = 0; i < dvdCast.cast.length; i++) {
//                                        $scope.dvd.actors += dvdCast.cast[i].name + ', ';
                                        $scope.dvd.actors.push( {name: dvdCast.cast[i].name + ' (' + dvdCast.cast[i].character + ')'} );
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
                        $scope.dynamicFindPopover = $scope.dynamicFindPopoverStatus.error;
                    }
                },
                function err() {
                    // Called asynchronously if an error occurs or server returns response with an error status.
                    console.log('Error when getting the movie ID from internet');

                    // We set the popover message and the class button error
                    $scope.dvd.searchError = true;
                    $scope.dynamicFindPopover = $scope.dynamicFindPopoverStatus.error;
                });
        };

        /**
         * Save the new DVD in the database.
         */
        $scope.performSave = function () {
            // We check if a DVD already exist in the database
            var check = Dvd.DvdAdd.isDvdExist({'dvdTitle': $scope.dvd.title}, function () {
                if (check.success) {
                    console.log('DVD already exist');

                    // We notify to the user that the save failed because the DVD already exist
                    $scope.dynamicSavePopover = $scope.dynamicSavePopoverStatus.error;
                }
                else {
                    // We save the movie poster
                    var renamedImage = Dvd.DvdAdd.renameImage({'temporaryFilename': $scope.dvd.temporaryMoviePosterName, 'filename': IdGenerator.moviePosterID($scope.dvd.title)}, function () {
                        if (renamedImage.success) {
                            console.log('Image successfully renamed');

                            // We save the DVD in the database
                            var dvd = Dvd.DvdAdd.saveDvd({'dvd': $scope.dvd, 'owner': $scope.owner}, function () {
                                if (dvd.success) {
                                    console.log('DVD added successfully');
                                }
                                else {
                                    console.log("Error when added the DVD");
                                }
                            });

                            // We notify to the user that the save performed
                            $scope.dynamicSavePopover = $scope.dynamicSavePopoverStatus.success;

                            // We redirect to the index view
                            $location.url('/dvd-list');
                        }
                        else {
                            console.log("Error when renamed the image");

                            // We notify to the user that the save performed
                            $scope.dynamicSavePopover = $scope.dynamicSavePopoverStatus.retry;
                        }
                    });
                }
            });
        };

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
);
