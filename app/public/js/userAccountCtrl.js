/**
 * Controllers.
 */
var userAccountControllers = angular.module('userAccountControllers', ['ngRoute']);


/**
 * User Account controllers.
 */
userAccountControllers.controller('UserAccountCtrl', ['$scope', '$location', 'User',
    function ($scope, $location, User) {
        // We get the current user
        $scope.user = User.UserAccount.getCurrentUser(function() {
            if($scope.user.success) {
//                console.log($scope.user);
                $scope.user = $scope.user.user;
                $scope.newPassword = undefined
                $scope.newEmail = $scope.user.email
                $scope.status = {
                    default: undefined,
                    updated: "Compte mis à jour",
                    value: undefined
                }

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
                    // We update the user account
                    var userUpdated = User.UserAccount.updateUser({'username': userName, 'userID': $scope.user._id, 'newEmail': newEmail, 'newPassword': newPassword}, function () {
                        // If the user is successfully updated, we redirect to the dvd list view
                        if(userUpdated.success) {
                            console.log('User successfully updated');
                            $scope.status.value = $scope.status.updated
//                    $location.url('/dvd-list');
                        }

                        else {
                            $scope.status.value = userUpdated.status
                        }
                    });
                }
            });
        };
    }
]);