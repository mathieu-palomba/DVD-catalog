/**
 * Controllers.
 */
var userAccountControllers = angular.module('userAccountControllers', ['ngRoute']);


/**
 * User Account controllers.
 */
userAccountControllers.controller('UserAccountCtrl', ['$scope', '$location', '$route', '$window', '$upload', 'User', 'GenresConstant', 'DvdFormatsConstant',
    function ($scope, $location, $route, $window, $upload, User, GenresConstant, DvdFormatsConstant) {
        console.log('User account controller');

        // Status messages
        $scope.status = {
            default: undefined,
            updated: "Compte mis à jour",
            value: undefined
        };

        $scope.accordion = {
            isOpen: false,
            closeOthers: false
        };

        // Charts
        $scope.genresChartID = "genresChart";
        $scope.formatsChartID = "formatsChart";

        // We get the current user
        $scope.user = User.UserAccount.getCurrentUser(function() {
            if($scope.user.success) {
                $scope.user = $scope.user.user[0];
                $scope.newUserName = $scope.user.username;
                $scope.newEmail = $scope.user.email;
                $scope.newPassword = undefined;

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
                                // If the user is successfully updated
                                if(userUpdated.success) {
                                    console.log('User successfully updated')

                                    // Set new (or old) values
                                    $scope.user.username = $scope.newUserName;
                                    $scope.user.email = $scope.newEmail;

                                    // OK message
                                    $scope.status.value = $scope.status.updated

//                                    $window.location.reload();
                                }

                                else {
                                    $scope.status.value = userUpdated.status;
                                }
                            });
                        }

                        else {
                            $scope.status.value = ownerUpdated.status;
                        }
                    });
                }
            });
        };

        $scope.deleteAccount = function(user) {
            console.log('Delete current account')
            // We ask user confirmation
            bootbox.confirm("<span class='delete-account'>Voulez-vous vraiment supprimer votre compte utilisateur? Une fois supprimer, vous ne pourrez plus récuperer l\'ensemble des informations liées à celui-ci.</span>", function(result) {
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
                data = JSON.stringify(data, undefined, 4);
            }

            var blob = new Blob([data], {type: 'text/json'}),
                e    = document.createEvent('MouseEvents'),
                a    = document.createElement('a');

            a.download = fileName + '.json';
            a.href = window.URL.createObjectURL(blob);
            a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':');
            e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
        };

        // Method with AngularJS and server calling (read with 'files.file[0].path' in the server side
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

        // Read file with AngularJS
        $scope.showContent = function($fileContent){
            console.log('Read file')
            $scope.content = JSON.parse($fileContent);
            console.log($scope.content)
        };

        $scope.updateImgSrcPath = function() {
            var ownerUpdated = User.UserAccount.updateImgSrcPath({}, function () {
                if (ownerUpdated.success) {
                    console.log('Owner updated');
                }
            });
        };

        // TEST CHARTS
        $scope.$watch('owner.dvd',function(){
            if($scope.owner && $scope.owner.dvd){
                // Initialize variables
                $scope.movieGenres = _.sortBy(GenresConstant, function (genre) {return genre});
                $scope.movieFormats = _.sortBy(DvdFormatsConstant, function (format) {return format});
                $scope.dataGenres = {};
                $scope.dataFormats = {};

                // Compute data
                angular.forEach($scope.owner.dvd, function(value, key) {
                    var dvd = value;

                    // Handle genres
                    angular.forEach(dvd.genres, function(value, key) {
                        var genre = value;

                        if (!_.has($scope.dataGenres, genre.name)) {
                            $scope.dataGenres[genre.name] = 1;
                        }
                        else {
                            $scope.dataGenres[genre.name] += 1;
                        }
                    });

                    // Handle formats
                    if (!_.has($scope.dataFormats, dvd.movieFormat)) {
                        $scope.dataFormats[dvd.movieFormat] = 1;
                    }
                    else {
                        $scope.dataFormats[dvd.movieFormat] += 1;
                    }

                });

                // Compute not listed genres and formats
                var genresNotListed = _.difference($scope.movieGenres, _.keys($scope.dataGenres));
                var formatsNotListed = _.difference($scope.movieFormats, _.keys($scope.dataFormats));

                // We add the not listed genres and formats to match index in the dataset
                _.each(genresNotListed, function(genreNameNotListed) {
                    $scope.dataGenres[genreNameNotListed] = 0;
                });

                _.each(formatsNotListed, function(formatNameNotListed) {
                    $scope.dataFormats[formatNameNotListed] = 0;
                });

                // Compute chart datasets
                var chartDataGenres = {
                    labels: $scope.movieGenres,
                    datasets: [
                        {
                            label: "Movie genres dataset",
                            fillColor: "rgba(220,220,220,0.2)",
                            strokeColor: "rgba(220,220,220,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: _.sortBy($scope.dataGenres, function (value, key) {return key})
                        }
                    ]
                };

                var chartDataFormats = {
                    labels: $scope.movieFormats,
                    datasets: [
                        {
                            label: "Movie formats dataset",
                            fillColor: "rgba(220,220,220,0.2)",
                            strokeColor: "rgba(220,220,220,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: _.sortBy($scope.dataFormats, function (value, key) {return key})
                        }
                    ]
                };

                // Create charts
                var genresCtx = document.getElementById($scope.genresChartID).getContext("2d");
                var genresChart = new Chart(genresCtx).Bar(chartDataGenres);

                var formatsCtx = document.getElementById($scope.formatsChartID).getContext("2d");
                var formatsChart = new Chart(formatsCtx).Radar(chartDataFormats);
            }
        });
    }
]);