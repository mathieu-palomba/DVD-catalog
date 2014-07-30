/**
 * Controllers.
 */
var userAdministrationControllers = angular.module('userAdministrationControllers', ['ngRoute']);


/**
 * User Administration controllers.
 */
userAdministrationControllers.controller('UserAdministrationCtrl', ['$scope', '$route', 'User',
    function ($scope, $route, User) {
        console.log('User administration controller');

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
                            var foundUser = _.findWhere($scope.users, {username: ownerName});

                            // We get the isAdmin properties when the user name equal the owner name
                            if (foundUser != undefined) {
                                owner.isAdmin = foundUser.isAdmin;
                                owner.userID = foundUser._id;
                            }
                        }

                        // Alphabetically order
                        $scope.owners = _.sortBy($scope.owners, function (user) {return user.userName});
                    }
                });
            }
        });

        $scope.deleteAccount = function(owner) {
            console.log('Delete account ' + owner.userName)

            // We ask user confirmation
            bootbox.confirm('Voulez-vous vraiment supprimer le compte utilisateur de <b><i>' + owner.userName + '</i></b> ?', function(result) {
                // OK clicked
                if(result) {
                    if (owner.isAdmin) {
                        // Nothing to do
                    }

                    else {
                        // Delete owner
                        var ownerStatus = User.Administration.deleteOwner({'ownerID': owner._id}, function () {
                            // If the owner has been correctly deleted
                            if(ownerStatus.success) {
                                console.log('Owner successfully deleted');

                                // Delete user
                                var userStatus = User.Administration.deleteUser({'userID': owner.userID}, function () {
                                    // If the user has been correctly deleted
                                    if(userStatus.success) {
                                        console.log('User successfully deleted');
                                        $route.reload();
                                    }
                                });
                            }
                        });
                    }
                }
            });
        };

        $scope.updateImgSrcPath = function() {
            var ownerUpdated = User.UserAccount.updateImgSrcPath({}, function () {
                if (ownerUpdated.success) {
                    console.log('Owner updated');
                }
            });
        };
    }
]);