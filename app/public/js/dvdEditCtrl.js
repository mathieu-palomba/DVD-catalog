/**
 * Controllers.
 */
var dvdEditControllers = angular.module('dvdEditControllers', ['ngRoute', 'ui.bootstrap']);


/**
 * DVD Edit controllers.
 */
dvdEditControllers.controller('DvdEditCtrl', ['$scope', '$location', '$routeParams', '$upload', '$window', 'Dvd', 'User', 'GenresConstant', 'DvdFormatsConstant', 'IdGenerator', 'MultiField', 'Array', 'Rating',
    function ($scope, $location, $routeParams, $upload, $window, Dvd, User, GenresConstant, DvdFormatsConstant, IdGenerator, MultiField, Array, Rating) {
        // Scroll of the top of the window per default
        $window.scrollTo(0, 0)

        // Rating handle
        $scope.max = Rating.max;
        $scope.isReadonly = Rating.readWrite;
        $scope.hoveringOver = function (value) {
            Rating.hoveringOver($scope, value);
        };

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

        // We get the genres list
        $scope.genres = _.sortBy(GenresConstant, function (genre) {return genre});
        $scope.defaultGenre = $scope.genres.default;
        $scope.currentGenre = $scope.defaultGenre;

        // The movie format list
        $scope.movieFormats = _.sortBy(DvdFormatsConstant, function (genre) {return genre});

        // Initialize the DVD form
        $scope.imagesFolder = 'img/users/movie-posters/';
        $scope.temporaryMoviePosterName = 'temporaryImg.jpg';
        $scope.moviePosterUplodedByUser = false;

        // We get the current user
        $scope.user = User.UserAccount.getCurrentUser(function() {
            if($scope.user.success) {
                $scope.user = $scope.user.user[0];

                // If the user isn't an admin, we delete the user parameter from the url
                if(!$scope.user.isAdmin && $routeParams.userName) {
                    $location.url('/dvd-list');
                }

                // Administration case
                if($scope.user.isAdmin && $routeParams.userName) {
                    // We get owner chosen in the administration view
                    $scope.owner = User.UserAccount.getOwner({'userName': $routeParams.userName}, function() {
                        if($scope.owner.success) {
                            console.log('From DVD details administration');
                            // We get the owner in relation with the url parameter
                            $scope.owner = $scope.owner.owner;

                            // We call the getDvd function to have the DVD details
                            $scope.getDvd();
                        }

                        else {
                            console.log('User ' + $routeParams.userName + ' not found')
                            $location.url('/dvd-list');
                        }
                    });
                }

                else {
                    // We get the current owner
                    $scope.owner = User.UserAccount.getCurrentOwner(function() {
                        if($scope.owner.success) {
                            console.log('From DVD details');
        //                    console.log($scope.owner.owner);
                            $scope.owner = $scope.owner.owner;

                            // We call the getDvd function to have the DVD details
                            $scope.getDvd();
                        }
                    });
                }
        }});

        // We get the DVD
        $scope.getDvd = function() {
            // We use '$scope.owner.userName' and not '$routeParams.userName' because if we are in the normal route (not from the administration), the '$routeParams.userName' doesn't exist
            $scope.dvdSearch = Dvd.DvdDetails.getDvd( {'dvdID': $routeParams.dvdID, 'userName': $scope.owner.userName}, function()
            {
                if( $scope.dvdSearch.success )
                {
                    console.log('DVD load successfully');
                    $scope.dvd = $scope.dvdSearch.dvd.dvd[0];

                    // In the case if user change the title
                    $scope.dvd.oldTitle = $scope.dvd.title;

                    // We set a new movie poster variable in the case of the user change the poster manually
                    $scope.moviePoster = $scope.dvd.moviePoster;
                }
                else
                {
                    console.log('Error when loading the DVD');
                    $location.url('/dvd-list');
                }
            } );
        };

        /**
         * Redirection into the DVD details html page (oldTitle because the film was not updated).
         */
        $scope.cancelEditDvd = function () {
            $location.url('/dvd/' + $scope.dvd._id);
        };

        // TODO genre
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
                    $scope.moviePosterUplodedByUser = true;

                    // We save the movie poster
                    var renamedImage = Dvd.DvdAdd.renameImage({'temporaryFilename': uploadedImageName, 'filename': $scope.temporaryMoviePosterName}, function () {
                        // If the image is successfully renamed, we set the new movie poster path
                        if(renamedImage.success) {
                            console.log('Image uploaded successfully renamed');

                            // We compute the string to hash (title + date to build unique key)
                            var titleHash = $scope.dvd.title + $scope.dvd.releaseDate;

                            // We set the new movie poster path
                            $scope.dvd.moviePoster = $scope.imagesFolder + IdGenerator.moviePosterID(titleHash);

                            // We use the date to generate a random string which it's used to reload the ng-src <img> tag
                            var random = (new Date()).toString();
                            $scope.moviePoster = $scope.imagesFolder + $scope.temporaryMoviePosterName + "?cb=" + random;
                        }
                    });
                });
//            }
        };


        /**
         * Update the current DVD with new informations.
         */
        $scope.performUpdate = function () {
            console.log('Update DVD');

            // If the title has changed, we rename the movie poster file and movie poster path
            if($scope.dvd.oldTitle != $scope.dvd.title) {
                // We compute the string to hash (title + date to build unique key)
                var titleHash = $scope.dvd.title + $scope.dvd.releaseDate;
                var oldTitleHash = $scope.dvd.oldTitle + $scope.dvd.releaseDate;

                $scope.dvd.moviePoster = $scope.imagesFolder + IdGenerator.moviePosterID(titleHash);

                // We rename the movie poster
                var renamedImage = Dvd.DvdAdd.renameImage({'temporaryFilename': IdGenerator.moviePosterID(oldTitleHash), 'filename': IdGenerator.moviePosterID(titleHash)}, function () {
                    if (renamedImage.success) {
                        console.log('Image successfully renamed');
                    }
                    else {
                        console.log("Error when saved the image");
                    }
                });
            }

            // If the picture change
            if ($scope.moviePosterUplodedByUser) {
                console.log('Change dvd image');
                var titleHash = $scope.dvd.title + $scope.dvd.releaseDate;

                // We rename the movie poster
                var renamedImage = Dvd.DvdAdd.renameImage({'temporaryFilename': $scope.temporaryMoviePosterName, 'filename': IdGenerator.moviePosterID(titleHash)}, function () {
                    if (renamedImage.success) {
                        console.log('Image successfully renamed');
                    }
                    else {
                        console.log("Error when saved the image");
                    }
                });

//                $scope.moviePosterUplodedByUser = false;
            }

            // We edit the DVD
            $scope.dvdEdited = Dvd.DvdDetails.editDvd({'dvd': $scope.dvd, 'owner': $scope.owner}, function () {
                if ($scope.dvdEdited.success) {
                    console.log('DVD edited successfully');

                    if($routeParams.userName) {
                        // We redirect into the DVD details administration view ( title because the film was updated)
                        $location.url('/dvd/' + $scope.owner.userName + '/' + $scope.dvd._id);
                    }

                    else {
                        // We redirect into the DVD details view ( title because the film was updated)
                        $location.url('/dvd/' + $scope.dvd._id);
                    }
                }
                else {
                    console.log('Error when deleting the DVD');
                }
            });
        };
    }
]);