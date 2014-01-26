/**
 * Controllers.
 */
var userAdministrationControllers = angular.module('userAdministrationControllers', ['ngRoute']);


/**
 * User Administration controllers.
 */
userAdministrationControllers.controller('UserAdministrationCtrl', ['$scope', 'User',
    function ($scope, User) {
        // We get the all of the owners
        $scope.owners = User.Administration.getOwners(function() {
            if($scope.owners.success) {
                console.log($scope.owners);
                $scope.owners = $scope.owners.owners;
            }
        });
    }
]);