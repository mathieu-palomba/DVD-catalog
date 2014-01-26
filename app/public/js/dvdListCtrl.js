/**
 * Controllers.
 */
var dvdListControllers = angular.module('dvdListControllers', ['ngRoute']);

/**
 * DVD List controllers.
 */
dvdListControllers.controller('DvdListCtrl', ['$scope', '$location', '$route', 'Dvd', 'User', 'Rating',
    function ($scope, $location, $route, Dvd, User, Rating) {
        console.log('Dvd List controller');

        // Rating handle
        $scope.max = Rating.max;
        $scope.isReadonly = Rating.readOnly;

        // We get the current owner
        $scope.owner = User.UserAccount.getCurrentOwner(function() {
            if($scope.owner.success) {
                console.log($scope.owner);
            }
        });

        // We get the DVD list
        $scope.dvdList = Dvd.DvdList.getAllDvd(function()
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