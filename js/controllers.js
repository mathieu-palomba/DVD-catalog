 /**
  * Controllers.
  */
 var phonecatControllers = angular.module('phonecatControllers', []);

 /**
  * Phone List controllers.
  */
 phonecatControllers.controller('PhoneListCtrl', ['$scope', 'Phone',
 	function($scope, Phone) {
 		// Method without our service
 		/*$http.get('phones/phones.json').success(function(data) {
 			$scope.phones = data;
 		});*/

        // Method with our service
        $scope.phones = Phone.query();

        // This value must have the same name in the html view to set the default filter
 		$scope.orderProp = 'age';
 	}
 ]);

 /**
  * Phone Details controllers.
  */
 phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone',
 	function($scope, $routeParams, Phone) {
        // Method without our service
 		/*$http.get('phones/' + $routeParams.phoneId + '.json').success(function(data) {
 			$scope.phone = data;
            $scope.mainImageUrl = data.images[0];
 		});*/

        // Method with our service
        $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
            $scope.mainImageUrl = phone.images[0];
        });

        $scope.setImage = function(imageUrl) {
            $scope.mainImageUrl = imageUrl;
        }
 	}
 ]);