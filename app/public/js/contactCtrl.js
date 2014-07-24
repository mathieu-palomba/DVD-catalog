/**
 * Created by Mathieu Palomba on 24/07/14.
 */
/**
 * Controllers.
 */
var contactControllers = angular.module('contactControllers', ['ngRoute']);

/**
 * User Account controllers.
 */
contactControllers.controller('ContactCtrl', ['$scope', 'User', 'Contact',
    function ($scope, User, Contact) {
        $scope.subjects = {
            subject1: 'J\'ai une suggestion',
            subject2: 'J\'ai trouvé un bug',
            subject3: 'Autre'
        };

        $scope.email = {
            userName: '',
            subject: '',
            emailAddress: '',
            message: ''
        };

        // We get the current user
        $scope.user = User.UserAccount.getCurrentUser(function() {
            if($scope.user.success) {
                $scope.user = $scope.user.user[0];
                $scope.email.userName = $scope.user.username;
                $scope.email.emailAddress = $scope.user.email;

                $scope.owner = User.UserAccount.getCurrentOwner(function() {
                    if($scope.owner.success) {
                        // We get the owner in relation with the url parameter
                        $scope.owner = $scope.owner.owner;
                    }
                });
            }
        });

        $scope.performSend = function() {
            console.log($scope.email)

            var sentMessage = Contact.sendEmail({'email': $scope.email}, function () {
                // if the message its successfully sent
                if (sentMessage.success) {
                    console.log('Email successfully sent');
                }
            });
        };
    }
]);