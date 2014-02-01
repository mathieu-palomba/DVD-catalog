/**
 * Controllers.
 */
var dvdEditControllers = angular.module('dvdEditControllers', ['ngRoute']);


/**
 * DVD Edit controllers.
 */
dvdEditControllers.controller('DvdEditCtrl', ['$scope', '$location', '$routeParams', 'Dvd', 'User', 'GenresConstant', 'IdGenerator', 'Actors', 'Rating',
    function ($scope, $location, $routeParams, Dvd, User, GenresConstant, IdGenerator, Actors, Rating) {
        console.log('Dvd Edit controller');

        // Rating handle
        $scope.max = Rating.max;
        $scope.isReadonly = Rating.readWrite;
        $scope.hoveringOver = function (value) {
            Rating.hoveringOver($scope, value);
        };

        // We get the genres list
        $scope.genres = GenresConstant;

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
            $scope.dvdSearch = Dvd.DvdDetails.getDvd( {'dvdTitle': $routeParams.dvdTitle, 'userName': $scope.owner.userName}, function()
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
                    $location.url('/dvd-list');
                }
            } );
        };

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
                var renamedImage = Dvd.DvdAdd.renameImage({'temporaryFilename': IdGenerator.moviePosterID($scope.dvd.oldTitle), 'filename': IdGenerator.moviePosterID($scope.dvd.title)}, function () {
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
                        $location.url('/dvd/' + $scope.owner.userName + '/' + $scope.dvd.title);
                    }

                    else {
                        // We redirect into the DVD details view ( title because the film was updated)
                        $location.url('/dvd/' + $scope.dvd.title);
                    }
                }
                else {
                    console.log('Error when deleting the DVD');
                }
            });
        };
    }
]);