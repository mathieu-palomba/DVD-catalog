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
                console.log('Owners successfully found');
                $scope.owners = $scope.owners.owners;
//                console.log($scope.owners);

                // We get all of the user to add the isAdmin properties to all of the owners
                $scope.users = User.Administration.getUsers(function() {
                    if($scope.users.success) {
                        console.log('Users successfully found');
                        $scope.users = $scope.users.users;

                        // For all owner, we add the isAdmin properties
                        for(var ownerID in $scope.owners) {
                            var owner = $scope.owners[ownerID];
                            var ownerName = owner.userName;

                            // We search the user in relation with the owner
                            for(var userID in $scope.users) {
                                var user = $scope.users[userID];
                                var userName = user.username;

                                // We get the isAdmin properties when the user name equal the owner name
                                if(userName == ownerName) {
                                    owner.isAdmin = user.isAdmin;
                                }
                            }
                        }
                    }
                });
            }
        });
    }
]);