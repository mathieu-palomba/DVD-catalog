/**
 * Controllers.
 */
var userAccountControllers = angular.module('userAccountControllers', ['ngRoute']);


/**
 * User Account controllers.
 */
userAccountControllers.controller('UserAccountCtrl', ['$scope', '$location', '$route', '$window', 'User',
    function ($scope, $location, $route, $window, User) {
        // We get the current user
        $scope.user = User.UserAccount.getCurrentUser(function() {
            if($scope.user.success) {
//                console.log($scope.user);
                $scope.user = $scope.user.user;
                $scope.newUserName = $scope.user.username
                $scope.newEmail = $scope.user.email
                $scope.newPassword = undefined
                $scope.status = {
                    default: undefined,
                    updated: "Compte mis à jour",
                    value: undefined
                }

                $scope.owner = User.UserAccount.getOwner({'userName': $scope.user.username}, function() {
                    if($scope.owner.success) {
                        // We get the owner in relation with the url parameter
                        $scope.owner = $scope.owner.owner;
                    }
                });

                // We format the created date
//                var date = $scope.user.created;
//                var year = parseInt(date.substring(0, 4));
//                var month = parseInt(date.substring(5, 7));
//                var day = parseInt(date.substring(8,10));
//
//                var hours = parseInt(date.substring(11, 13));
//                var minutes = parseInt(date.substring(14, 16));
//                var seconds = parseInt(date.substring(17, 19));
//
//                var d = new Date(year, month-1, day, hours, minutes, seconds);
//                $scope.user.created = d.toLocaleString();
            }
        });

        $scope.login = function(userName, newEmail, newPassword) {
            // We ask user confirmation
            bootbox.confirm('Voulez-vous vraiment mettre à jour votre profil utilisateur?', function(result) {
                // OK clicked
                if(result) {

                    // We update the owner account
                    var ownerUpdated = User.UserAccount.updateCurrentOwner({'userName': userName}, function () {
                        // If the user is successfully updated, we redirect to the dvd list view
                        if(ownerUpdated.success) {
                            console.log('Owner successfully updated')

                            // We update the user account
                            var userUpdated = User.UserAccount.updateCurrentUser({'username': userName, 'newEmail': newEmail, 'newPassword': newPassword}, function () {
                                // If the user is successfully updated, we redirect to the dvd list view
                                if(userUpdated.success) {
                                    console.log('User successfully updated')
                                    $window.location.reload();
//                                    $scope.status.value = $scope.status.updated
                                }

                                else {
                                    $scope.status.value = userUpdated.status
                                }
                            });
                        }

                        else {
                            $scope.status.value = ownerUpdated.status
                        }
                    });
                }
            });
        };

        $scope.deleteAccount = function(user) {
            console.log('Delete current account')
            // We ask user confirmation
            bootbox.confirm('Voulez-vous vraiment supprimer votre compte utilisateur ?', function(result) {
                // OK clicked
                if(result) {
                    // Owner delete
                    var ownerStatus = User.UserAccount.deleteCurrentOwner({'ownerID': $scope.owner._id}, function () {
                        // If the owner has been correctly deleted
                        if(ownerStatus.success) {
                            console.log('Owner successfully deleted');

                            // User delete
                            var userStatus = User.UserAccount.deleteCurrentUser({'userID': user._id}, function () {
                                // If the user has been correctly deleted
                                if(userStatus.success) {
                                    console.log('User successfully deleted');

                                    // Logout
                                    User.UserAccount.logout(function () {
                                        // Logout
                                        console.log('User successfully logout');
//                        $window.location.href = "/"
                                        $window.location.reload();
                                    });
                                }
                            });
                        }
                    });
                }
            });
        };
    }
]);