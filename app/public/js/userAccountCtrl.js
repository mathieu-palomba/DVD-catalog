/**
 * Controllers.
 */
var userAccountControllers = angular.module('userAccountControllers', ['ngRoute']);


/**
 * User Account controllers.
 */
userAccountControllers.controller('UserAccountCtrl', ['$scope', 'Dvd',
    function ($scope, Dvd) {
        // We get the current user
        $scope.user = Dvd.DvdList.getCurrentUser(function() {
            if($scope.user.success) {
                console.log($scope.user);
                $scope.user = $scope.user.user;

                // We format the created date
                var date = $scope.user.created;
                var year = parseInt(date.substring(0, 4));
                var month = parseInt(date.substring(5, 7));
                var day = parseInt(date.substring(8,10));

                var hours = parseInt(date.substring(11, 13));
                var minutes = parseInt(date.substring(14, 16));
                var seconds = parseInt(date.substring(17, 19));

                var d = new Date(year, month-1, day, hours, minutes, seconds);
                $scope.user.created = d.toLocaleString();
            }
        });
    }
]);