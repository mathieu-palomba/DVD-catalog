/**
 * Controllers.
 */
var phonecatControllers = angular.module('phonecatControllers', []);

/**
 * Phone List controllers.
 */
phonecatControllers.controller('PhoneListCtrl', ['$scope', '$location', 'Phone', 'GetMovieData',
    function ($scope, $location, Phone, GetMovieData) {
        console.log("Phone List controller");
        // Method without our service
        /*$http.get('phones/phones.json').success(function(data) {
         $scope.phones = data;
         });*/

        // Method with our service
        $scope.phones = Phone.query();

        // This value must have the same name in the html view to set the default filter
        $scope.orderProp = 'age';

        /**
         * Redirection into the add phone html page.
         */
        $scope.addPhone = function () {
            $location.url('/addPhone');
        };
    }
]);

/**
 * Phone Details controllers.
 */
phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone',
    function ($scope, $routeParams, Phone) {
        console.log("Phone details controller");
        // Method without our service
        /*$http.get('phones/' + $routeParams.phoneId + '.json').success(function(data) {
         $scope.phone = data;
         $scope.mainImageUrl = data.images[0];
         });*/

        // Method with our service
        $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function (phone) {
            $scope.mainImageUrl = phone.images[0];
        });

        $scope.setImage = function (imageUrl) {
            $scope.mainImageUrl = imageUrl;
        }
    }
]);

/**
 * Add Phone controllers.
 */
phonecatControllers.controller('PhoneAddCtrl', ['$scope', '$location',
    function ($scope, $location) {
        console.log("Add phone controller");

        $scope.genres = {
            action: 'Action',
            adventure: 'Aventure',
            animation: 'Animation',
            comedy: 'Comedie',
            crime: 'Policier',
            disaster: 'Catastrophique',
            documentary: 'Documentaire',
            drama: 'Dramatique',
            erotic: 'Erotique',
            family: 'Famille',
            fantastic: 'Fantastique',
            martialArts: 'Arts Martiaux',
            horror: 'Horreur',
            musical: 'Musical',
            romance: 'Romantique',
            scienceFiction: 'Science fiction',
            thriller: 'Thriller',
            war: 'Guerre',
            western: 'Western'
        };

        /**
         * Redirection into the index html page.
         */
        $scope.cancelAddPhone = function () {
            $location.url('/phone');
        };
    }]
)
;