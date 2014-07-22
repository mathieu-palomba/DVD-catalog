/**
 * Created by Mathieu Palomba on 09/05/14.
 */

var dvdCatDirectives = angular.module('dvdCatDirectives', []);

dvdCatDirectives.directive('dropdownMultiselect', function(){
    return {
        restrict: 'E',
        scope:{
            label: '@', // @ for Attributes
            model: '=',
            options: '=',
            onUpdate: '&onUpdate',
            resetFilter: '&resetFilter',
            filterEnabled: "=",
            pre_selected: '=preSelected'
        },
        templateUrl:  '../views/templates/dropdown-multiselect.html',
        controller: function($scope){
            $scope.isEnabled = ($scope.model.length > 0);

            $scope.openDropdown = function() {
                $scope.selected_items = [];
                for(var i=0; i<$scope.pre_selected.length; i++){
                    $scope.selected_items.push($scope.pre_selected[i].id);
                }
            };

            $scope.selectAll = function() {
                // Select all genre with assignable variable to true
                $scope.model = _.chain($scope.options)
                    .map(function(obj){
                        obj.assignable = true;
                        return obj;
                    })
                    .pluck('id')
                    .value();

                // Update filter
                $scope.onUpdate();
//                console.log($scope.model);
            };
            $scope.deselectAll = function() {
                $scope.model = [];
                $scope.options = _.map($scope.options, function(obj){
                                        obj.assignable = false;
                                        return obj;
                                    });

                $scope.resetFilter();
//                console.log($scope.model);
            };
            $scope.setSelectedItem = function($event) {
                // Stop propagation to avoid closing the popup every time you click
                $event.stopPropagation()

                var id = this.option.id;
                if (_.contains($scope.model, id)) {
                    $scope.model = _.without($scope.model, id);
                } else {
                    $scope.model.push(id);
                }

                var itemChecked = _.contains($scope.model, id);
                $scope.options[id].assignable = itemChecked;

                // Update filter
                $scope.onUpdate();

                return false;
            };
            $scope.isChecked = function(id) {
                // We get the item state to update it's boolean value in the dvd list model
                var itemChecked = _.contains($scope.model, id);
//                $scope.options[id].assignable = itemChecked;

                if (itemChecked) {
                    return 'icon-ok pull-right';
                }
                return false;
            };
//            $scope.isCheckEnabled = function(model) {
//                console.log('isCheckEnabled')
//                console.log(model.length)
//                if(model.length > 0) {
//                    return 'btn btn-info dropdown-toggle';
//                }
//
//                return 'btn dropdown-toggle';
//            };
        }
    }
});

dvdCatDirectives.directive('onReadFile', function ($parse) {
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs) {
            var fn = $parse(attrs.onReadFile);

            element.on('change', function(onChangeEvent) {
                var reader = new FileReader();

                reader.onload = function(onLoadEvent) {
                    scope.$apply(function() {
                        fn(scope, {$fileContent:onLoadEvent.target.result});
                    });
                };

                reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
            });
        }
    };
});

dvdCatDirectives.directive('showtab',
    function () {
        return {
            link: function (scope, element, attrs) {
                element.on('click', function(e){
                    element.show();
                    e.preventDefault();
                });
            }
        };
});

dvdCatDirectives.directive('scroll', function($window) {
    return {
        restrict: 'A',
        link: function(scope, $elm) {
            angular.element($window).bind("scroll", function() {
                if ($(this).scrollTop() > 100) {
                    $elm.fadeIn();
                } else {
                    $elm.fadeOut();
                }
            });

            $elm.click(function () {
                $("html, body").animate({
                    scrollTop: 0
                }, 600);
                return false;
            });
        }
    }
});
