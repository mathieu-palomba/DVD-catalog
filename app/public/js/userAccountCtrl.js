/**
 * Controllers.
 */
var userAccountControllers = angular.module('userAccountControllers', ['ngRoute']);


/**
 * User Account controllers.
 */
userAccountControllers.controller('UserAccountCtrl', ['$scope', '$location', '$route', '$window', '$upload', 'User', 'GenresConstant', 'DvdFormatsConstant', 'Preferences',
    function ($scope, $location, $route, $window, $upload, User, GenresConstant, DvdFormatsConstant, Preferences) {
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

            // Call AES encryption
            var encrypted = CryptoJS.AES.encrypt(data, 'MySecretKey');

            var blob = new Blob([encrypted], {type: 'text/json'}),
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

            var decryptedData = CryptoJS.AES.decrypt($fileContent, 'MySecretKey');
            $scope.content = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));

            console.log($scope.content)
        };

        // Handle charts
        $scope.$watch('owner.dvd', function(){
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

        // Handle preferences
        $scope.backgroundPaths = {
            path1: 'img/dvd-catalog/bg.png',
            path2: 'img/dvd-catalog/bg-2.png',
            path3: 'img/dvd-catalog/bg-3.png',
            path4: 'img/dvd-catalog/bg-4.png',
            path5: 'img/dvd-catalog/bg-5.png',
            path6: 'img/dvd-catalog/bg-6.png'
        };

        $scope.changeBackground = function(backgroundPath) {
            var userPreferencesUpdated = User.UserAccount.updateCurrentUserPreferences({'newBackgroundPath': backgroundPath}, function() {
               if (userPreferencesUpdated.success) {
                   console.log('Background preference updated');

                   // Update background in CSS
                   Preferences.updateBackground(backgroundPath);

                   // Reload route to update thumbnail selection
                   $route.reload();
               }
            });
        };

        $scope.isEnabled = function(backgroundPath) {
            if($scope.user && $scope.user.preferences && $scope.user.preferences[0]){
                return $scope.user.preferences[0].backgroundPath == backgroundPath;
            }
        };

        $scope.JSONToCSVConvertor = function() {
            var JSONData = $scope.owner.dvd;
            var ReportTitle = "Test";
            var ShowLabel = true;

            // Compute the model to export
            angular.forEach(JSONData, function(value, key) {
                var dvd = value;

                delete dvd._id;
                delete dvd.moviePoster;
                delete dvd.borrower;
                delete dvd.postersPath;
                delete dvd.trailers;
                delete dvd.voteCount;
                delete dvd.voteAverage;
                delete dvd.revenue;
                delete dvd.popularity;
                delete dvd.budget;
                delete dvd.actors;
                delete dvd.genres;
                delete dvd.movieID;
            });

            // If JSONData is not an object then JSON.parse will parse the JSON string in an Object
            var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

            var CSV = '';
            // Set Report title in first row or line

            CSV += ReportTitle + '\r\n\n';

            // This condition will generate the Label/Header
            if (ShowLabel) {
                var row = "";

                // This loop will extract the label from 1st index of on array
                var objectKeys = Object.keys(arrData[0])
                for (var index in objectKeys) {
                    index = parseInt(index)
                    var objectKey = objectKeys[index]
                    //Now convert each value to string and comma-seprated
                    row += objectKey + ';';
                }

                row = row.slice(0, -1);

                // Append Label row with line break
                CSV += row + '\r\n';
            }

            // 1st loop is to extract each row
            for (var i = 0; i < arrData.length; i++) {
                var row = "";

                // 2nd loop will extract each column and convert it in string comma-seprated
                for (var index in objectKeys) {
                    index = parseInt(index)
                    var objectKey = objectKeys[index]
                    row += '"' + arrData[i][objectKey] + '";';
                }

                row.slice(0, row.length - 1);

                // Add a line break after each row
                CSV += row + '\r\n';
            }

            if (CSV == '') {
                alert("Invalid data");
                return;
            }

            // Generate a file name
            var fileName = "MyReport_";
            // This will remove the blank-spaces from the title and replace it with an underscore
            fileName += ReportTitle.replace(/ /g,"_");

            // Initialize file format you want csv or xls
            var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

            // Now the little tricky part.
            // you can use either>> window.open(uri);
            // but this will not work in some browsers
            // or you will not get the correct file extension

            // This trick will generate a temp <a /> tag
            var link = document.createElement("a");
            link.href = uri;

            // Set the visibility hidden so it will not effect on your web-layout
            link.style = "visibility:hidden";
            link.download = fileName + ".csv";

            // This part will append the anchor tag and remove it after automatic click
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
    }
]);