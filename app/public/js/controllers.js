/**
 * Controllers.
 */
var dvdCatControllers = angular.module('dvdCatControllers', ['ui.bootstrap', 'ngRoute']);

/**
 * DVD List controllers.
 */
dvdCatControllers.controller('DvdListCtrl', ['$scope', '$location', '$route', 'Dvd', 'Rating',
    function ($scope, $location, $route, Dvd, Rating) {
        console.log('Dvd List controller');

        // Rating handle
        $scope.max = Rating.max;
        $scope.isReadonly = Rating.readOnly;

        // We get the current user
        $scope.owner = Dvd.DvdList.getCurrentOwner(function() {
            if($scope.owner.success) {
                console.log($scope.owner);
            }
        });

        // We get the DVD list
        $scope.dvdList = Dvd.DvdList.getAllDvd( function()
        {
            if( $scope.dvdList.success ) {
                console.log('DVD got successfully');
                console.log($scope.dvdList.dvdList[0].dvd);
                $scope.dvdList = $scope.dvdList.dvdList[0].dvd;
            }
            else {
                console.log('Error when getting the DVD list');
                $scope.dvdList = []
            }
        } );

        // This value must have the same name in the html view to set the default filter
        $scope.orderProp = 'title';

        /**
         * Redirection into the add DVD html page.
         */
        $scope.addDvd = function () {
            $location.url('/addDvd');
        };

        /**
         * Delete the selected DVD.
         */
        $scope.deleteDvd = function(dvd) {
            // We ask user confirmation
            bootbox.confirm('Are you sure to delete ' + dvd.title + '?', function(result) {
                // OK clicked
                if(result) {
                    // We delete the DVD
                    $scope.dvdDeleted = Dvd.DvdList.deleteDvd( {dvd: dvd, owner: $scope.owner}, function() {
                        if( $scope.dvdDeleted.success ) {
                            console.log('DVD deleted successfully');
                            $route.reload();
                        }
                        else {
                            console.log('Error when deleting the DVD');
                        }
                    } );
                }
            });
        };
    }
]);

/**
 * DVD Details controllers.
 */
dvdCatControllers.controller('DvdDetailCtrl', ['$scope', '$routeParams', '$location', 'Dvd', 'Rating',
    function ($scope, $routeParams, $location, Dvd, Rating) {
        console.log('Dvd Details controller');

        // Rating handle
        $scope.max = Rating.max;
        $scope.isReadonly = Rating.readOnly;

        // We get the DVD
        $scope.dvdSearch = Dvd.DvdDetails.getDvd( {dvd: $routeParams.dvd}, function()
        {
            if( $scope.dvdSearch.success )
            {
                console.log('DVD got successfully');
                console.log($scope.dvdSearch.dvd.dvd[0]);
                $scope.dvd = $scope.dvdSearch.dvd.dvd[0];
            }
            else
            {
                console.log('Error when getting the DVD');
                $location.url('/dvd');
            }
        } );

        /**
         * Redirection into the edit DVD html page.
         */
        $scope.editDvd = function(dvdId) {
            $location.url('/editDvd/' + dvdId);
        };

        /**
         * Redirection into the DVD list html page.
         */
        $scope.back = function() {
            $location.url('/dvd');
        };
    }
]);

/**
 * Add DVD controllers.
 */
dvdCatControllers.controller('DvdAddCtrl', ['$scope', '$location', '$http', 'Dvd', 'MovieDB', 'GenresConstant', 'IdGenerator', 'Actors',
    function ($scope, $location, $http, Dvd, MovieDB, GenresConstant, IdGenerator, Actors) {
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

        /**
         * Redirection into the index html page.
         */
        $scope.cancelAddDvd = function () {
            $location.url('/dvd');
        };

        /**
         * Add a new Actor.
         */
        $scope.addInputActor = function() {
            Actors.addInputActor($scope);
        };

        /**
         * Delete the current Actor.
         * @param actor: The actor to delete
         */
        $scope.deleteThisActor = function(actor) {
            Actors.deleteThisActor($scope, actor);
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
                        var dvdDetails = MovieDB.GetMovieDetails.request({ queryVar: dvdID.results[0].id, apiKeyVar: $scope.requests.movieDBKey, languageVar: 'fr' },
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
                        var dvdCast = MovieDB.GetMovieCast.request({ queryVar: dvdID.results[0].id, apiKeyVar: $scope.requests.movieDBKey, languageVar: 'fr' },
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
            var check = Dvd.DvdAdd.isDvdExist({dvd: $scope.dvd.title}, function () {
                if (check.success) {
                    console.log('DVD already exist');

                    // We notify to the user that the save failed because the DVD already exist
                    $scope.dynamicSavePopover = $scope.dynamicSavePopoverStatus.error;
                }
                else {
                    // We save the movie poster
                    var renamedImage = Dvd.DvdAdd.renameImage({temporaryFilename: $scope.dvd.temporaryMoviePosterName, filename: IdGenerator.moviePosterID($scope.dvd.title)}, function () {
                        if (renamedImage.success) {
                            console.log('Image successfully renamed');

                            // We save the DVD in the database
                            var dvd = Dvd.DvdAdd.saveDvd({dvd: $scope.dvd, owner: $scope.owner}, function () {
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
                            $location.url('/dvd');
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

/**
 * DVD Edit controllers.
 */
dvdCatControllers.controller('DvdEditCtrl', ['$scope', '$location', '$routeParams', 'Dvd', 'GenresConstant', 'IdGenerator', 'Actors', 'Rating',
    function ($scope, $location, $routeParams, Dvd, GenresConstant, IdGenerator, Actors, Rating) {
        console.log('Dvd Edit controller');

        // Rating handle
        $scope.max = Rating.max;
        $scope.isReadonly = Rating.readWrite;
        $scope.hoveringOver = function (value) {
            Rating.hoveringOver($scope, value);
        };

        // We get the current user
        $scope.owner = Dvd.DvdList.getCurrentOwner(function() {
            if($scope.owner.success) {
                console.log($scope.owner);
            }
        });

        // We get the genres list
        $scope.genres = GenresConstant;

        // We get the DVD
        $scope.dvdSearch = Dvd.DvdDetails.getDvd( {dvd: $routeParams.dvdId}, function()
        {
            if( $scope.dvdSearch.success )
            {
                console.log('DVD load successfully');
                $scope.dvd = $scope.dvdSearch.dvd.dvd[0];

                // In the case if user change the title
                $scope.dvd.oldTitle = $scope.dvd.title;

                // We set the previous rate order
                $scope.rate = $scope.dvd.rate;
            }
            else
            {
                console.log('Error when loading the DVD');
                $location.url('/dvd');
            }
        } );

        /**
         * Redirection into the DVD details html page (oldTitle because the film was not updated).
         */
        $scope.cancelEditDvd = function () {
            $location.url('/dvd/' + $scope.dvd.oldTitle);
        };

        /**
         * Add a new Actor.
         */
        $scope.addInputActor = function() {
            Actors.addInputActor($scope);
        };

        /**
         * Delete the current Actor.
         * @param actor: The actor to delete
         */
        $scope.deleteThisActor = function(actor) {
            Actors.deleteThisActor($scope, actor);
        };


        /**
         * Update the current DVD with new informations.
         */
        $scope.performUpdate = function () {
            console.log('Update DVD');

            // We get the current rate
            $scope.dvd.rate = $scope.rate;

            // If the title has changed, we rename the movie poster file and movie poster path
            if($scope.dvd.oldTitle != $scope.dvd.title) {
                $scope.dvd.moviePoster = 'img/' + IdGenerator.moviePosterID($scope.dvd.title);

                // We rename the movie poster
                var renamedImage = Dvd.DvdAdd.renameImage({temporaryFilename: IdGenerator.moviePosterID($scope.dvd.oldTitle), filename: IdGenerator.moviePosterID($scope.dvd.title)}, function () {
                    if (renamedImage.success) {
                        console.log('Image successfully renamed');
                    }
                    else {
                        console.log("Error when saved the image");
                    }
                });
            }

            // We edit the DVD
            $scope.dvdEdited = Dvd.DvdDetails.editDvd({dvd: $scope.dvd, owner: $scope.owner}, function () {
                if ($scope.dvdEdited.success) {
                    console.log('DVD edited successfully');

                    // We redirect into the DVD details view ( title because the film was updated)
                    $location.url('/dvd/' + $scope.dvd.title);
                }
                else {
                    console.log('Error when deleting the DVD');
                }
            });
        };
    }
]);