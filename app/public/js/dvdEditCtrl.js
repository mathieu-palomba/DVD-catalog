/**
 * Controllers.
 */
var dvdEditControllers = angular.module('dvdEditControllers', ['ngRoute', 'ui.bootstrap']);


/**
 * DVD Edit controllers.
 */
dvdEditControllers.controller('DvdEditCtrl', ['$scope', '$location', '$routeParams', 'Dvd', 'User', 'GenresConstant', 'DvdFormatsConstant', 'IdGenerator', 'MultiField', 'Array', 'Rating',
    function ($scope, $location, $routeParams, Dvd, User, GenresConstant, DvdFormatsConstant, IdGenerator, MultiField, Array, Rating) {
        console.log('Dvd Edit controller');

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
        $scope.genres = GenresConstant;
        $scope.defaultGenre = $scope.genres.default;
        $scope.currentGenre = $scope.defaultGenre;

        // The movie format list
        $scope.movieFormats = DvdFormatsConstant;

        // Administration case
        if($routeParams.userName) {
            // We get owner chosen in the administration view
            $scope.owner = User.UserAccount.getOwner({'userName': $routeParams.userName}, function() {
                if($scope.owner.success) {
                    console.log('From DVD details administration');
                    // We get the owner in relation with the url parameter
                    $scope.owner = $scope.owner.owner;

                    // We call the getDvd function to have the DVD details
                    getDvd();
                }
            });
        }

        else {
            // We get the current owner
            $scope.owner = User.UserAccount.getCurrentOwner(function() {
                if($scope.owner.success) {
                    console.log('From DVD details');
                    console.log($scope.owner.owner);
                    $scope.owner = $scope.owner.owner;

                    // We call the getDvd function to have the DVD details
                   getDvd();
                }
            });
        }

        // We get the DVD
        getDvd = function() {
            // We use '$scope.owner.userName' and not '$routeParams.userName' because if we are in the normal route (not from the administration), the '$routeParams.userName' doesn't exist
            $scope.dvdSearch = Dvd.DvdDetails.getDvd( {'dvdID': $routeParams.dvdID, 'userName': $scope.owner.userName}, function()
            {
                if( $scope.dvdSearch.success )
                {
                    console.log('DVD load successfully');
                    $scope.dvd = $scope.dvdSearch.dvd.dvd[0];

                    // In the case if user change the title
                    $scope.dvd.oldTitle = $scope.dvd.title;
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
         * Update the current DVD with new informations.
         */
        $scope.performUpdate = function () {
            console.log('Update DVD');

            // If the title has changed, we rename the movie poster file and movie poster path
            if($scope.dvd.oldTitle != $scope.dvd.title) {
                // We compute the string to hash (title + date to build unique key)
                var titleHash = $scope.dvd.title + $scope.dvd.releaseDate;
                var oldTitleHash = $scope.dvd.oldTitle + $scope.dvd.releaseDate;

                $scope.dvd.moviePoster = 'img/' + IdGenerator.moviePosterID(titleHash);

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