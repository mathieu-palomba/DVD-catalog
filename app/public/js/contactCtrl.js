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
contactControllers.controller('ContactCtrl', ['$scope', '$location', '$timeout', 'User', 'Contact',
    function ($scope, $location, $timeout, User, Contact) {
        console.log('Contact controller');

        $scope.subjects = {
            subject1: 'J\'ai une suggestion',
            subject2: 'J\'ai trouvé un bug',
            subject3: 'Autre'
        };

        $scope.email = {
            userName: '',
            subject: '',
            from: '',
            message: ''
        };

        $scope.status = {
            default: undefined,
            sent: "Email envoyé à l'administrateur du site",
            error: "Erreur durant l'envoie de l'email. Veuillez réessayer demain.",
            value: undefined
        };

        // We get the current user
        $scope.user = User.UserAccount.getCurrentUser(function() {
            if($scope.user.success) {
                $scope.user = $scope.user.user[0];
                $scope.email.userName = $scope.user.username;
                $scope.email.from = $scope.user.email;

                $scope.owner = User.UserAccount.getCurrentOwner(function() {
                    if($scope.owner.success) {
                        // We get the owner in relation with the url parameter
                        $scope.owner = $scope.owner.owner;
                    }
                });
            }
        });

        $scope.performSend = function() {
            var sentMessage = Contact.sendEmail({'email': $scope.email}, function () {
                // if the message its successfully sent
                if (sentMessage.success) {
                    console.log('Email successfully sent');

                    $scope.status.value = $scope.status.sent;

                    // Timeout to display success message during 1.5s
                    $timeout(function() {
                        $location.url('/dvd-list');
                    }, 1500);
                }

                else {
                    $scope.status.value = $scope.status.error;
                }
            });
        };
    }
]);