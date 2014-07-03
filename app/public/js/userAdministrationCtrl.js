/**
 * Controllers.
 */
var userAdministrationControllers = angular.module('userAdministrationControllers', ['ngRoute']);


/**
 * User Administration controllers.
 */
userAdministrationControllers.controller('UserAdministrationCtrl', ['$scope', '$route', 'User',
    function ($scope, $route, User) {
        // We get the all of the owners
        $scope.owners = User.Administration.getOwners(function() {
            if($scope.owners.success) {
                console.log('Owners successfully found');
                $scope.owners = $scope.owners.owners;
//                console.log($scope.owners);

                // TODO TO improve for perfo
                // We get all of the user to add the isAdmin properties to all of the owners
                $scope.users = User.Administration.getUsers(function() {
                    if($scope.users.success) {
                        console.log('Users successfully found');
                        $scope.users = $scope.users.users;

                        // For all owner, we add the isAdmin property
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
                                    owner.userID = user._id
                                }
                            }
                        }
                    }
                });
            }
        });

        $scope.deleteAccount = function(owner) {
            console.log('Delete account ' + owner.userName)

            // We ask user confirmation
            bootbox.confirm('Voulez-vous vraiment supprimer le compte utilisateur de ' + owner.userName + ' ?', function(result) {
                // OK clicked
                if(result) {
                    if (owner.isAdmin) {
                        // Nothing to do
                    }

                    else {
                        var status = User.Administration.deleteOwner({'ownerID': owner._id}, function () {
                            // If the owner has been correctly deleted
                            if(status.success) {
                                console.log('Owner successfully deleted');
                                $route.reload();
                            }
                        });


                        var status = User.Administration.deleteUser({'userID': owner.userID}, function () {
                            // If the user has been correctly deleted
                            if(status.success) {
                                console.log('User successfully deleted');
                                $route.reload();
                            }
                        });
                    }
                }
            });
        };
    }
]);