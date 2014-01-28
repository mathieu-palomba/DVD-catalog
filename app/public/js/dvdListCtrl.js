/**
 * Controllers.
 */
var dvdListControllers = angular.module('dvdListControllers', ['ngRoute']);

/**
 * DVD List controllers.
 */
dvdListControllers.controller('DvdListCtrl', ['$scope', '$location', '$route', '$routeParams', 'Dvd', 'User', 'Rating',
    function ($scope, $location, $route, $routeParams, Dvd, User, Rating) {
        console.log('Dvd List controller');

        // Rating handle
        $scope.max = Rating.max;
        $scope.isReadonly = Rating.readOnly;

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
                    $scope.href = "#/user/";

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
                    $scope.dvdDeleted = Dvd.DvdList.deleteDvd( {'dvd': dvd, 'owner': $scope.owner}, function() {
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