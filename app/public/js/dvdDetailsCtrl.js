/**
 * Controllers.
 */
var dvdDetailsControllers = angular.module('dvdDetailsControllers', ['ngRoute']);


/**
 * DVD Details controllers.
 */
dvdDetailsControllers.controller('DvdDetailsCtrl', ['$scope', '$routeParams', '$location', 'Dvd', 'User', 'Rating',
    function ($scope, $routeParams, $location, Dvd, User, Rating) {
        console.log('Dvd Details controller');

        // Rating handle
        $scope.max = Rating.max;
        $scope.isReadonly = Rating.readOnly;

        // We get the current owner
        $scope.owner = User.UserAccount.getCurrentOwner(function() {
            if($scope.owner.success) {
                console.log($scope.owner);
            }
        });

        // We get the DVD
        $scope.dvdSearch = Dvd.DvdDetails.getDvd( {'dvd': $routeParams.dvdTitle}, function()
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
                $location.url('/dvd-list');
            }
        } );

        /**
         * Redirection into the edit DVD html page.
         */
        $scope.editDvd = function(dvdName) {
            $location.url('/editDvd/' + dvdName);
        };

        /**
         * Redirection into the DVD list html page.
         */
        $scope.back = function() {
            $location.url('/dvd-list');
        };
    }
]);