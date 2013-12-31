/**
 * Controllers.
 */
var phonecatControllers = angular.module('phonecatControllers', []);

/**
 * Phone List controllers.
 */
phonecatControllers.controller('PhoneListCtrl', ['$scope', 'Phone', 'GetMovieData',
    function ($scope, Phone, GetMovieData) {
        // Method without our service
        /*$http.get('phones/phones.json').success(function(data) {
         $scope.phones = data;
         });*/

        // Method with our service
        $scope.phones = Phone.query();

        // This value must have the same name in the html view to set the default filter
        $scope.orderProp = 'age';

        // This request get the movie ID to get the movie informations
        $scope.page = GetMovieData.getData("https://api.themoviedb.org/3/search/movie?api_key=37c2294ca3753bd14d165eda4b3f9314&query=Avatar&language=fr&callback=JSON_CALLBACK");

        // This request get the movie information from the previous request
        $scope.page = GetMovieData.getData("https://api.themoviedb.org/3/movie/19995?api_key=37c2294ca3753bd14d165eda4b3f9314&language=fr&callback=JSON_CALLBACK");
    }
]);

/**
 * Phone Details controllers.
 */
phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone',
    function ($scope, $routeParams, Phone) {
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
 * Get phone informations.
 */
//phonecatControllers.controller('PhoneGetInformations', ['$scope',
//    function ($scope) {
//        $scope.getXhr = function () {
//            var xhr = null;
//            if (window.XMLHttpRequest) // Firefox et autres
//                xhr = new XMLHttpRequest();
//            else if (window.ActiveXObject) { // Internet Explorer
//                try {
//                    xhr = new ActiveXObject("Msxml2.XMLHTTP");
//                } catch (e) {
//                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
//                }
//            }
//            else { // XMLHttpRequest non supporté par le navigateur
//                alert("Votre navigateur ne supporte pas les objets XMLHTTPRequest...");
//                xhr = false;
//            }
//            return xhr
//        };
//
//        $scope.getInformations = function() {
//            var xhr = $scope.getXhr()
//            // On défini ce qu'on va faire quand on aura la réponse
//            xhr.onreadystatechange = function () {
//                // On ne fait quelque chose que si on a tout reçu et que le serveur est ok
//                if (xhr.readyState == 4 && xhr.status == 200) {
//                    alert(xhr.responseText);
//                }
//            }
//            xhr.open("GET", "http://www.allocine.fr/recherche/?q=avatar", true);
//            xhr.send(null);
//            console.log(xhr);
//        };
//
//        $scope.getInformations;
//    }]
//);