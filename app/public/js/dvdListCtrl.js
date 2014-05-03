/**
 * Controllers.
 */
var dvdListControllers = angular.module('dvdListControllers', ['ngRoute', 'ui.bootstrap']);

/**
 * DVD List controllers.
 */
dvdListControllers.controller('DvdListCtrl', ['$scope', '$location', '$route', '$routeParams', 'Dvd', 'User', 'Rating', 'DvdFormatsConstant',
    function ($scope, $location, $route, $routeParams, Dvd, User, Rating, DvdFormatsConstant) {
        console.log('Dvd List controller');

        // Accordion handle
        $scope.oneAtATime = true;

        // Order prop handle
        // This value must have the same name in the html view to set the default filter
        $scope.orderProp = 'title';

        // Set a new selection
        $scope.setOrderProp = function(orderProp) {
            $scope.orderProp = orderProp;
        };

        // Rating handle
        $scope.max = Rating.max;
        $scope.isReadonly = Rating.readOnly;

        // Movie format handle
        $scope.movieFormats = DvdFormatsConstant;
        $scope.showAll = "--- Tous ---";
        $scope.currentMovieFormat = $scope.showAll;

        // Set a new selection
        $scope.setMovieFormat = function(movieFormat) {
            $scope.currentMovieFormat = movieFormat;
        };

        // Custom filter - filter based on the movie format
        $scope.movieFormatFilter = function (data) {
            if (data.movieFormat === $scope.currentMovieFormat) {
                return true;
            } else if ($scope.currentMovieFormat === $scope.showAll) {
                return true;
            } else {
                return false;
            }
        };

        // If the DVD list it's call with the administration route, we get the owner in relation
        if($routeParams.userName) {
            // We get owner chosen in the administration view
            $scope.owner = User.UserAccount.getOwner({'userName': $routeParams.userName}, function() {
                if($scope.owner.success) {
                    // We get the owner in relation with the url parameter
                    $scope.owner = $scope.owner.owner;

                    // We get the DVD list in relation with this owner
                    $scope.dvdList = $scope.owner.dvd;

                    // We set a variable that used in the 'dvd-list' to know which route set to the 'dvd details' view
                    $scope.href = "#/dvd/" + $scope.owner.userName + "/";

                }
            });
        }

        // Else, we display the current owner in relation with the user logged
        else {
            // We get the current owner
            $scope.owner = User.UserAccount.getCurrentOwner(function() {
                if($scope.owner.success) {
                    $scope.owner = $scope.owner.owner;
                }
            });

            // We get the DVD list (NOT NECESSARY because we have the owner, but it's a seconf method)
            $scope.dvdList = Dvd.DvdList.getAllDvd(function()
            {
                if( $scope.dvdList.success ) {
                    console.log('DVD got successfully');
                    console.log($scope.dvdList.dvdList[0].dvd);

                    // We get the DVD list in relation with this owner
                    $scope.dvdList = $scope.dvdList.dvdList[0].dvd;

                    // We set a variable that used in the 'dvd-list' to know which route set to the 'dvd details' view
                    $scope.href = "#/dvd/";
                }
                else {
                    console.log('Error when getting the DVD list');
                    $scope.dvdList = []
                }
            } );
        }

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
            bootbox.confirm('Voulez-vous vraiment supprimer <b><i>' + dvd.title + '</i></b> de vôtre collection?', function(result) {
                // OK clicked
                if(result) {
                    // We delete the DVD
                    $scope.dvdDeleted = Dvd.DvdList.deleteDvd( {'dvdID': dvd._id, 'userName': $scope.owner.userName}, function() {
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