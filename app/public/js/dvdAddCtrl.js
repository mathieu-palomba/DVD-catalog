/**
 * Controllers.
 */
var dvdAddControllers = angular.module('dvdAddControllers', ['ui.bootstrap', 'ngRoute', 'angularFileUpload']);


/**
 * Add DVD controllers.
 */
dvdAddControllers.controller('DvdAddCtrl', ['$scope', '$location', '$http', '$upload', '$window', 'Dvd', 'User', 'MovieDB', 'GenresConstant', 'DvdFormatsConstant',
                                            'IdGenerator', 'MultiField', 'Array', 'Rating',
    function ($scope, $location, $http, $upload, $window, Dvd, User, MovieDB, GenresConstant, DvdFormatsConstant, IdGenerator, MultiField, Array, Rating) {
        console.log('Dvd Add controller');

        // Scroll of the top of the window per default
        $window.scrollTo(0, 0)

        // The default movie poster.
        $scope.imagesFolder = 'img/';
        $scope.defaultMoviePoster = $scope.imagesFolder + 'unknown.jpg';
        $scope.moviePoster = $scope.defaultMoviePoster;

        // The different movie genres.
        $scope.genres = GenresConstant;
        $scope.defaultGenre = $scope.genres.default;
        $scope.currentGenre = $scope.defaultGenre;

        // The movie format list.
        $scope.movieFormats = DvdFormatsConstant;

        // Initialize the DVD form.
        $scope.dvd = {
            searchError: false,
            temporaryMoviePosterName: 'temporaryImg.jpg',
            title: '',
            moviePoster: $scope.defaultMoviePoster,
            genres: [],
            releaseDate: '',
            overview: '',
            productionCompanies: '',
            director: '',
            actors: [ {name: '', character: ''} ],
            movieFormat: $scope.movieFormats.dvd,
            location: ''
        };

        // Initialize the dynamic popover when the user search a movie not recorder in the movieDB.
        $scope.dynamicFindPopoverStatus = {
            error: 'Le film n\'est pas répertorié',
            success: 'Le film à été trouvé'
        };
        $scope.dynamicFindPopover = $scope.dynamicFindPopoverStatus.success;
        $scope.dynamicFindPopoverPlacement = 'up';
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

        // Initialize Date picker
        $scope.open = function($event) {
            console.log("Date open");
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            'year-format': "'yyyy'",
            'starting-day': 1
        };

        // We select the first date format
        $scope.formats = ['dd/MMMM/yyyy', 'yyyy-MM-dd', 'shortDate'];
        $scope.format = $scope.formats[0];

        // We get the current owner
        $scope.owner = User.UserAccount.getCurrentOwner(function() {
            if($scope.owner.success) {
//                console.log($scope.owner);
            }
        });

        // Rating handle
        $scope.max = Rating.max;
        $scope.isReadonly = Rating.readWrite;
        $scope.hoveringOver = function (value) {
            Rating.hoveringOver($scope, value);
        };


        /**
         * Redirection into the index html page.
         */
        $scope.cancelAddDvd = function () {
            $location.url('/dvd-list');
        };

        /**
         * This function permit to select an other DVD title that are display in the combo box.
         * @param item : The selected DVD
         */
        $scope.otherDvdTitleChoice = function(item) {
            // We set the nex dvd title selected by the user
            $scope.dvd.title = item.title;

            // We recall the check movie information method to get the new information
            $scope.checkMovieInformationByID(item.id);
        };

        /**
         * This function permit to reset the movie poster image when the DVD title it's null.
         * @param title : The DVD title
         */
        $scope.dvdTitleChanged = function(title) {
            // If the dvd title has no length, we set the default movie poster image to avoid poster problem (the poster isn't the poster in relation with the dvd title)
            if(!title) {
                $scope.moviePoster = $scope.defaultMoviePoster;
            }
        };

        /**
         * This function it's call when the user select an other poster image with the file browser.
         */
        $scope.onFileSelect = function($files) {
            // $files: an array of files selected, each file has name, size, and type.
//            for (var i = 0; i < $files.length; i++) {
            var $file = $files[0];
            $upload.upload({
                url: '/upload',
                method: 'POST',
                file: $file,
                progress: function(e){}
            }).progress(function(evt) {
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).then(function(data, status, headers, config) {
                    // File is uploaded successfully
                    console.log('File successfully uploaded');
                    var uploadedImageName = data.data.uploadedImageName;
                    var newImageName = data.data.newImageName;

                    // We save the movie poster
                    var renamedImage = Dvd.DvdAdd.renameImage({'temporaryFilename': uploadedImageName, 'filename': $scope.dvd.temporaryMoviePosterName}, function () {
                        // If the image is successfully renamed, we set the new movie poster path
                        if(renamedImage.success) {
                            console.log('Image uploaded successfully renamed');

                            // We compute the string to hash (title + date to build unique key)
                            var titleHash = $scope.dvd.title + $scope.dvd.releaseDate;

                            // We set the new movie poster path
                            $scope.dvd.moviePoster = $scope.imagesFolder + IdGenerator.moviePosterID(titleHash);

                            // We use the date to generate a random string which it's used to reload the ng-src <img> tag
                            var random = (new Date()).toString();
                            $scope.moviePoster = $scope.imagesFolder + $scope.dvd.temporaryMoviePosterName + "?cb=" + random;;
                        }
                    });
             });
//            }
        };

        /**
         * This function it's call when the user select a genre in the combo box.
         * She add a new genre with the 'addInputGenre' method call.
         */
        $scope.genreChange = function () {
            if(!Array.inArray($scope.dvd.genres, $scope.currentGenre)) {
                $scope.addInputGenre($scope.currentGenre);
            }

            // We reset the genre name in the combo box
            $scope.currentGenre = $scope.defaultGenre;
        };

        /**
         * Add a new genre.
         * @param actor: The genre to add
         */
        $scope.addInputGenre = function(genre) {
            MultiField.addInputField($scope.dvd.genres, genre);
        };

        /**
         * Delete the current genre.
         * @param actor: The genre to delete
         */
        $scope.deleteThisGenre = function(genre) {
            MultiField.deleteThisField($scope.dvd.genres, genre);
        };

        /**
         * Add a new Actor.
         */
        $scope.addInputActor = function() {
            MultiField.addInputField($scope.dvd.actors, '');
        };

        /**
         * Delete the current Actor.
         * @param actor: The actor to delete
         */
        $scope.deleteThisActor = function(actor) {
            MultiField.deleteThisField($scope.dvd.actors, actor);
        };

        /**
         * Get the movie information with the movie name to fill out the DVD structure.
         */
        $scope.checkMovieInformationByName = function () {
            console.log('Checking movie data: ' + $scope.dvd.title);

            // We get the movie ID
            var dvdID = MovieDB.GetMovieID.request({'apiKeyVar': $scope.requests.movieDBKey, 'queryVar': $scope.dvd.title, 'languageVar': 'fr'},
                function success() {
                    // This callback will be called asynchronously when the response is available
                    if(dvdID.results.length > 0) {
                        console.log('Movie ID got from internet');
//                        console.log(dvdID);

                        // We set the popover message and the class button OK
                        $scope.dvd.searchError = false;
                        $scope.dynamicFindPopover = $scope.dynamicFindPopoverStatus.success;

                        // We get all of the results
                        $scope.dvdIdResults = dvdID.results;

                        $scope.checkMovieInformationByID(dvdID.results[0].id);
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
         * Get the movie information with the movie ID to fill out the DVD structure.
         */
        $scope.checkMovieInformationByID = function(movieID) {
            // If an ID is founded, we can get the movie details
            var dvdDetails = MovieDB.GetMovieDetails.request({ 'queryVar': movieID, 'apiKeyVar': $scope.requests.movieDBKey, 'languageVar': 'fr' },
                function success() {
                    // This callback will be called asynchronously when the response is available
                    console.log('Movie details got from internet');
//                    console.log(dvdDetails);

                    // Set the movie poster url and the movie title.
                    $scope.dvd.title = dvdDetails.title;

                    if(dvdDetails.poster_path != undefined && dvdDetails.poster_path != null) {
                        // We compute the string to hash (title + date to build unique key)
                        var titleHash = $scope.dvd.title + $scope.dvd.releaseDate;

                        $scope.dvd.moviePoster = $scope.imagesFolder + IdGenerator.moviePosterID(titleHash);
                        $scope.moviePoster = $scope.requests.images.replace('VAR_QUERY', dvdDetails.poster_path);

                        // We pre-saved the movie poster to win time (avoid time problem when the user saved it's DVD and it's relocated in the "/dvd" route)
                        var saveImage = Dvd.DvdAdd.saveImage({uri: $scope.moviePoster, filename: $scope.dvd.temporaryMoviePosterName}, function() {
                            if (saveImage.success) {
                                console.log('Image successfully saved');
                            }
                            else {
                                console.log("Error when saved the image");
                            }
                        });
                    }

                    // We fill out the movies form
                    if(dvdDetails.genres.length > 0 ) {
                        // We get all of the DVD genres
                        $scope.dvd.genres = []

                        // We add all of the DVD genres
                        for(var genreID in dvdDetails.genres) {
                            $scope.dvd.genres.push({name: dvdDetails.genres[genreID].name});
                        }
                    }

                    $scope.dvd.movieID = dvdDetails.id;
                    $scope.dvd.releaseDate = dvdDetails.release_date;
                    $scope.dvd.overview = dvdDetails.overview;
                    $scope.dvd.popularity = dvdDetails.popularity;
                    $scope.dvd.budget = dvdDetails.budget;
                    $scope.dvd.revenue = dvdDetails.revenue;
                    $scope.dvd.voteAverage = dvdDetails.vote_average;
                    $scope.dvd.voteCount = dvdDetails.vote_count;
                    $scope.dvd.runtime = dvdDetails.runtime;
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
            var dvdCast = MovieDB.GetMovieCast.request({ 'queryVar': movieID, 'apiKeyVar': $scope.requests.movieDBKey, 'languageVar': 'fr' },
                function success() {
                    // This callback will be called asynchronously when the response is available
                    console.log('Movie cast got from internet');
//                    console.log(dvdCast);

                    // We fill out the movies form
                    if(dvdCast.crew.length > 0) {
                        $scope.dvd.director = dvdCast.crew[0].name;
                    }
                    $scope.dvd.actors = [];

                    // If the list isn't empty
                    if(dvdCast.cast.length > 5) {
                        for (var i = 0; i < 5; i++) {
//                                        $scope.dvd.actors += dvdCast.cast[i].name + ', ';
                            $scope.dvd.actors.push( {name: dvdCast.cast[i].name, character: dvdCast.cast[i].character} );
                        }
                    }

                    else {
                        for (var i = 0; i < dvdCast.cast.length; i++) {
//                                        $scope.dvd.actors += dvdCast.cast[i].name + ', ';
                            $scope.dvd.actors.push( {name: dvdCast.cast[i].name, character: dvdCast.cast[i].character} );
                        }
                    }
                },
                function err() {
                    // Called asynchronously if an error occurs or server returns response with an error status.
                    console.log('Error when getting the movie cast from internet');
                });
        };

        /**
         * Save the new DVD in the database.
         */
        $scope.performSave = function () {
            // We check if a DVD already exist in the database
            var check = Dvd.DvdAdd.isDvdExist({'dvdTitle': $scope.dvd.title, 'releaseDate': $scope.dvd.releaseDate}, function () {
                if (check.success) {
                    console.log('DVD already exist');

                    // We notify to the user that the save failed because the DVD already exist
                    $scope.dynamicSavePopover = $scope.dynamicSavePopoverStatus.error;
                }
                else {
                    // We compute the string to hash (title + date to build unique key)
                    var titleHash = $scope.dvd.title + $scope.dvd.releaseDate;

                    // We save the movie poster
                    var renamedImage = Dvd.DvdAdd.renameImage({'temporaryFilename': $scope.dvd.temporaryMoviePosterName, 'filename': IdGenerator.moviePosterID(titleHash)}, function () {
                        // If the image is successfully renamed (because the user use the find movie button), or if the moviePoster has the default name (inconnu.jpg picture), we save the dvd
                        if (renamedImage.success || $scope.moviePoster == $scope.dvd.moviePoster) {
                            console.log('Image successfully renamed');

                            if($scope.moviePoster != $scope.dvd.moviePoster) {
                                console.log('Movie Poster ID changed');
                                $scope.dvd.moviePoster = $scope.imagesFolder + IdGenerator.moviePosterID(titleHash);
                            }

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

}]);
