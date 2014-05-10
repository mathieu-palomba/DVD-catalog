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
            pre_selected: '=preSelected'
        },
        template: "<div class='btn-group' data-ng-class='{open: open}'>"+
            "<a class='btn dropdown-toggle' data-toggle='dropdown' href='#'>{{label}} <span class='caret'></span> </a>" +
            "<ul class='dropdown-menu' aria-labelledby='dropdownMenu'>" +
            "<li><a data-ng-click='selectAll()'><i class='icon-ok-sign'></i>  Sélectionner Tout</a></li>" +
            "<li><a data-ng-click='deselectAll();'><i class='icon-remove-sign'></i>  Déselectionner Tout</a></li>" +
            "<li class='divider'></li>" +
            "<li data-ng-repeat='option in options'> <a data-ng-click='setSelectedItem($event)'>{{option.name}}<span data-ng-class='isChecked(option.id)'></span></a></li>" +
            "</ul>" +
            "</div>" ,
        controller: function($scope){

            $scope.openDropdown = function(){
                $scope.selected_items = [];
                for(var i=0; i<$scope.pre_selected.length; i++){
                    $scope.selected_items.push($scope.pre_selected[i].id);
                }
            };

            $scope.selectAll = function () {
                $scope.model = _.pluck($scope.options, 'id');
//                console.log($scope.model);
            };
            $scope.deselectAll = function() {
                $scope.model=[];
//                console.log($scope.model);
            };
            $scope.setSelectedItem = function($event){
                // Stop propagation to avoid closing the popup every time you click
                $event.stopPropagation()

                var id = this.option.id;
                if (_.contains($scope.model, id)) {
                    $scope.model = _.without($scope.model, id);
                } else {
                    $scope.model.push(id);
                }
//                console.log($scope.model);
                return false;
            };
            $scope.isChecked = function (id) {
                // We get the item state to update it's boolean value in the dvd list model
                var itemChecked = _.contains($scope.model, id);
                $scope.options[id].assignable = itemChecked;

                if (itemChecked) {
                    return 'icon-ok pull-right';
                }
                return false;
            };
        }
    }
});
