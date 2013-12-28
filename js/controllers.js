 /**
  * Controllers.
  */
 var phonecatControllers = angular.module('phonecatControllers', []);

 /**
  * Phone List controllers.
  */
 phonecatControllers.controller('PhoneListCtrl', ['$scope', '$http',
 	function($scope, $http) {
 		$http.get('phones/phones.json').success(function(data) {
 			$scope.phones = data;
 		});

        // This value must have the same name in the html view to set the default filter
 		$scope.orderProp = 'age';
 	}
 ]);

 /**
  * Phone Details controllers.
  */
 phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', '$http',
 	function($scope, $routeParams, $http) {
 		$http.get('phones/' + $routeParams.phoneId + '.json').success(function(data) {
 			$scope.phone = data;
 		});
 	}
 ]);