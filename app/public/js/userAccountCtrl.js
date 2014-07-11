/**
 * Controllers.
 */
var userAccountControllers = angular.module('userAccountControllers', ['ngRoute']);


/**
 * User Account controllers.
 */
userAccountControllers.controller('UserAccountCtrl', ['$scope', '$location', '$route', '$window', '$upload', 'User',
    function ($scope, $location, $route, $window, $upload, User) {
        // We get the current user
        $scope.user = User.UserAccount.getCurrentUser(function() {
            if($scope.user.success) {
                $scope.user = $scope.user.user[0]
                $scope.newUserName = $scope.user.username
                $scope.newEmail = $scope.user.email
                $scope.newPassword = undefined

                $scope.status = {
                    default: undefined,
                    updated: "Compte mis à jour",
                    value: undefined
                }

                $scope.owner = User.UserAccount.getCurrentOwner(function() {
                    if($scope.owner.success) {
                        // We get the owner in relation with the url parameter
                        $scope.owner = $scope.owner.owner;
                    }
                });
            }
        });

        $scope.updateAccount = function(userName, newEmail, newPassword) {
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
            bootbox.confirm('<b>Voulez-vous vraiment supprimer votre compte utilisateur? Une fois supprimer, vous ne pourrez plus récuperer l\'ensemble des informations liées à celui-ci.</b>', function(result) {
                // OK clicked
                if(result) {
                    // Owner delete
                    var ownerStatus = User.UserAccount.deleteCurrentOwner(function () {
                        // If the owner has been correctly deleted
                        if(ownerStatus.success) {
                            console.log('Owner successfully deleted');

                            // User delete
                            var userStatus = User.UserAccount.deleteCurrentUser(function () {
                                // If the user has been correctly deleted
                                if(userStatus.success) {
                                    console.log('User successfully deleted');

                                    // Logout
                                    User.UserAccount.logout(function () {
                                        // Logout
                                        console.log('User successfully logout');
//                                        $window.location.href = "/"
                                        $window.location.reload();
                                    });
                                }
                            });
                        }
                    });
                }
            });
        };

        $scope.exportJson = function() {
            var data = $scope.owner.dvd
            var fileName = '[Dvd_catalog]_Exported_Dvd_' + $scope.owner.userName

            if(typeof data === "object"){
                data = JSON.stringify(data, undefined, 4)
            }

            var blob = new Blob([data], {type: 'text/json'}),
                e    = document.createEvent('MouseEvents'),
                a    = document.createElement('a')

            a.download = fileName + '.json'
            a.href = window.URL.createObjectURL(blob)
            a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
            e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
            a.dispatchEvent(e)
        };

        $scope.importJson = function($files) {
            // $files: an array of files selected, each file has name, size, and type.
            var $file = $files[0];
            console.log($file)
            $upload.upload({
                url: '/uploadBackupFile',
                method: 'POST',
                file: $file,
                progress: function(e){}
            }).progress(function(evt) {
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                }).then(function(data, status, headers, config) {
                    // File is uploaded successfully
                    console.log('File successfully uploaded');
                    console.log(data)
                });
        };

        $scope.showContent = function($fileContent){
            console.log('Read file')
            $scope.content = JSON.parse($fileContent)
            console.log($scope.content)
        };
    }
]);