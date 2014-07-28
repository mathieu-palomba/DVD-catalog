/**
 * Controllers.
 */
var dvdListControllers = angular.module('dvdListControllers', ['ngRoute', 'ui.bootstrap', 'angular-loading-bar', 'ngAnimate']);

/**
 * DVD List controllers.
 */
dvdListControllers.controller('DvdListCtrl', ['$scope', '$location', '$cacheFactory', '$route', '$routeParams', '$window', '$anchorScroll', '$filter', '$timeout', 'Dvd', 'User', 'Rating',
                                              'GenresConstant', 'DvdFormatsConstant', 'Cache',
    function ($scope, $location, $cacheFactory, $route, $routeParams, $window, $anchorScroll, $filter, $timeout, Dvd, User, Rating, GenresConstant, DvdFormatsConstant, Cache) {
        console.log('Dvd List controller');

        // Object to handle progress bar
        $scope.progressBar = {
            loading: true,
            type: 'info',
            value: '0',
            max: '100'
        };

        // Scroll of the top of the window per default
        $window.scrollTo(0, 0);

        // Keep scroll position
        $scope.scrollPos = {}; // scroll position of each view

        $(window).on('scroll', function() {
            if ($scope.okSaveScroll) { // false between $routeChangeStart and $routeChangeSuccess
                $scope.scrollPos[$location.path()] = $(window).scrollTop();

                // We save the current position
                $scope.cache.put('scrollPos', $scope.scrollPos);
            }
        });

        // Route changed
        $scope.$on('$routeChangeStart', function() {
            $scope.okSaveScroll = false;

            // We save the current preference
            $scope.cache.put('dvdOpenStatus', $scope.status);
        });

        // Route restore
        $scope.$on('$routeChangeSuccess', function() {
            var scrollPos = 0;

            // We get the previous scroll position if it exist
            if($scope.cache.get('scrollPos') != undefined) {
                scrollPos = $scope.cache.get('scrollPos')[$location.path()];
            }

            // Use the timeout to have time to scroll to the old value
            $timeout(function(){
                $(window).scrollTop(scrollPos);
            }, 600);

            $scope.okSaveScroll = true;
        });

        // Accordion handle
        $scope.oneAtATime = false;
        $scope.isFirstFilterOpen = false;

        // We get the dvd item open status (in cache, is isn't the first loading)
        $scope.cache = Cache;
        if($scope.cache.get('dvdOpenStatus') != undefined) {
            $scope.status = $scope.cache.get('dvdOpenStatus');
        }
        else {
            $scope.dvdOpenStatus = false;
            $scope.status = {};
        }

        // Expand or collapse all of the Dvd items
        $scope.collapseExpandAll = function() {
            $scope.dvdOpenStatus = !$scope.dvdOpenStatus
            for(itemKey in $scope.status){
                $scope.status[itemKey] = $scope.dvdOpenStatus
            }
        };

        // Order prop handle
        // This value must have the same name in the html view to set the default filter
        $scope.orderProp = 'title';

        // Set a new selection
        $scope.setOrderProp = function(orderProp) {
            $scope.orderProp = orderProp;
        };

        // Rating handle
        $scope.max = Rating.max;
        $scope.isReadonly = Rating.readOnly;

        // Handle movie format filter
        $scope.movieFormats = DvdFormatsConstant;
        $scope.dvdFormats = [];
        $scope.selectedDvdFormats = [];
        var counter = 0;

        angular.forEach(DvdFormatsConstant, function(value, key){
            var newFormat = {};
            newFormat.id = counter++;
            newFormat.name = value;
            newFormat.assignable = false;

            // We push the new genre in the list
            $scope.dvdFormats.push(newFormat);
        });

        // Handle Dvd genres filter
        $scope.dvdGenres = [];
        $scope.selectedDvdGenres = [];
        var counter = 0;

        // We replace the french value (old value) by boolean value to use it in the checkbox filter
        angular.forEach(GenresConstant, function(value, key){
            var newGenre = {};
            newGenre.id = counter++;
            newGenre.name = value;
            newGenre.assignable = false;

            // We push the new genre in the list
            $scope.dvdGenres.push(newGenre);
        });

        // Handle all filters
        $scope.filteredMovieFormatDvdList = [];
        $scope.filteredDvdGenresDvdList = [];

        $scope.filterItems = function(){
            $scope.filteredDvdList = $filter('filter')($scope.dvdList, $scope.query);
        };

        $scope.movieFormatFilterItems = function(){
            // We compute the array of dvd format enabled
            $scope.dvdFormatsFilter = _.chain($scope.dvdFormats)
                .filter(function(obj){
                    if (obj.assignable) {
                        return obj;
                    }
                })
                .map(function(obj){
                    return obj.name;
                })
                .value();

            // We call the associated filter
            $scope.filteredMovieFormatDvdList = $filter('movieFormatFilter')($scope.dvdList, $scope.dvdFormatsFilter);

            // We update the dvd list to display
            if ($scope.filteredDvdGenresDvdList.length > 0){
                $scope.filteredDvdList = _.intersection($scope.filteredMovieFormatDvdList, $scope.filteredDvdGenresDvdList);
            }
            else {
                $scope.filteredDvdList = $scope.filteredMovieFormatDvdList
            }
        };

        $scope.dvdGenreFilterItems = function(){
            // We compute the array of genre names enabled
            $scope.genreNamesFilter = _.chain($scope.dvdGenres)
                .filter(function(obj){
                    if (obj.assignable) {
                        return obj;
                    }
                })
                .map(function(obj){
                    return obj.name;
                })
                .value();

            // We call the associated filter
            $scope.filteredDvdGenresDvdList = $filter('dvdGenresFilter')($scope.dvdList, $scope.genreNamesFilter);

            // We update the dvd list to display
            if ($scope.filteredMovieFormatDvdList.length > 0){
                $scope.filteredDvdList = _.intersection($scope.filteredDvdGenresDvdList, $scope.filteredMovieFormatDvdList);
            }
            else {
                $scope.filteredDvdList = $scope.filteredDvdGenresDvdList
            }
        };

        $scope.resetFilter = function(){
            $scope.filteredDvdList = $scope.dvdList;
        };

        $scope.resetMovieFormatFilter = function(){
            $scope.filteredMovieFormatDvdList = [];
            $scope.movieFormatFilterItems();
        };

        $scope.resetDvdGenreFilter = function(){
            $scope.filteredDvdGenresDvdList = [];
            $scope.dvdGenreFilterItems();
        };

        // We get the current user
        $scope.user = User.UserAccount.getCurrentUser(function() {
            if($scope.user.success) {
                $scope.user = $scope.user.user[0];

                // Update progress bar
                $scope.progressBar.value = '50';

                // If the user isn't an admin, we delete the user parameter from the url
                if(!$scope.user.isAdmin && $routeParams.userName) {
                    $location.url('/dvd-list');
                }

                // If the DVD list it's call with the administration route, we get the owner in relation
                if($scope.user.isAdmin && $routeParams.userName) {

                    // We get owner chosen in the administration view
                    $scope.owner = User.UserAccount.getOwner({'userName': $routeParams.userName}, function() {
                        if($scope.owner.success) {
                            $scope.initialize();

                            // We set a variable that used in the 'dvd-list' to know which route set to the 'dvd details' view
                            $scope.href = "#/dvd/" + $scope.owner.userName + "/";
                        }

                        else {
                            console.log('User ' + $routeParams.userName + ' not found')
                            $location.url('/dvd-list');
                        }
                    });
                }

                // Else, we display the current owner in relation with the user logged
                else {
                    // We get the current owner
                    $scope.owner = User.UserAccount.getCurrentOwner(function() {
                        if($scope.owner.success) {
                            $scope.initialize();

                            // We set a variable that used in the 'dvd-list' to know which route set to the 'dvd details' view
                            $scope.href = "#/dvd/";
                        }
                    });
                }
            }
        });

        /**
         * Initialize parameters which it's set in the current and url parameter case.
         */
        $scope.initialize = function() {
            // We get the owner in relation with the url parameter OR with the current owner
            $scope.owner = $scope.owner.owner;

            // We get the DVD list in relation with this owner
            $scope.dvdList = $scope.owner.dvd;

            // Variable which is used to filter items
            $scope.filteredDvdList = $scope.dvdList;

            // Remove progress bar
            $scope.progressBar.value = '100';
            $scope.progressBar.loading = false;
        };

        /**
         * Redirection into the add DVD html page.
         */
        $scope.addDvd = function () {
            $location.url('/addDvd');
        };

        /**
         * Delete the selected DVD.
         */
        $scope.deleteDvd = function(dvd) {
            // We ask user confirmation
            bootbox.confirm('Voulez-vous vraiment supprimer <b><i>' + dvd.title + '</i></b> de vôtre collection?', function(result) {
                // OK clicked
                if(result) {
                    // We delete the DVD
                    $scope.dvdDeleted = Dvd.DvdList.deleteDvd( {'dvdID': dvd._id, 'userName': $scope.owner.userName}, function() {
                        if( $scope.dvdDeleted.success ) {
                            console.log('DVD deleted successfully');
                            $route.reload();
                        }
                        else {
                            console.log('Error when deleting the DVD');
                        }
                    } );
                }
            });
        };

        $scope.JSONToCSVConvertor = function() {
            console.log("JSONToCSVConvertor");
            var JSONData = $scope.dvdList;
            var ReportTitle = "Test";
            var ShowLabel = true;

            //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
            var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

            var CSV = '';
            //Set Report title in first row or line

            CSV += ReportTitle + '\r\n\n';

            //This condition will generate the Label/Header
            if (ShowLabel) {
                var row = "";

                //This loop will extract the label from 1st index of on array
                var objectKeys = Object.keys(arrData[0])
                for (var index in objectKeys) {
                    index = parseInt(index)
                    var objectKey = objectKeys[index]
                    //Now convert each value to string and comma-seprated
                    row += objectKey + ';';
                }

                row = row.slice(0, -1);

                //append Label row with line break
                CSV += row + '\r\n';
            }

            //1st loop is to extract each row
            for (var i = 0; i < arrData.length; i++) {
                var row = "";

                // 2nd loop will extract each column and convert it in string comma-seprated
                for (var index in objectKeys) {
                    index = parseInt(index)
                    var objectKey = objectKeys[index]
                    row += '"' + arrData[i][objectKey] + '";';
                }

                row.slice(0, row.length - 1);

                //add a line break after each row
                CSV += row + '\r\n';
            }

            if (CSV == '') {
                alert("Invalid data");
                return;
            }

            //Generate a file name
            var fileName = "MyReport_";
            //this will remove the blank-spaces from the title and replace it with an underscore
            fileName += ReportTitle.replace(/ /g,"_");

            //Initialize file format you want csv or xls
            var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

            // Now the little tricky part.
            // you can use either>> window.open(uri);
            // but this will not work in some browsers
            // or you will not get the correct file extension

            //this trick will generate a temp <a /> tag
            var link = document.createElement("a");
            link.href = uri;

            //set the visibility hidden so it will not effect on your web-layout
            link.style = "visibility:hidden";
            link.download = fileName + ".csv";

            //this part will append the anchor tag and remove it after automatic click
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
    }
]);