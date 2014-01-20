/**
 * Controllers.
 */
var dvdDetailsControllers = angular.module('dvdDetailsControllers', ['ngRoute']);


/**
 * DVD Details controllers.
 */
dvdDetailsControllers.controller('DvdDetailsCtrl', ['$scope', '$routeParams', '$location', 'Dvd', 'Rating',
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