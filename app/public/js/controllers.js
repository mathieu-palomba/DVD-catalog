/**
 * Controllers.
 */
var dvdCatControllers = angular.module('dvdCatControllers', ['ui.bootstrap', 'ngRoute']);

/**
 * DVD List controllers.
 */
dvdCatControllers.controller('DvdListCtrl', ['$scope', '$location', 'Dvd',
    function ($scope, $location, Dvd) {
        console.log('Dvd List controller');

        // We get the DVD list
        $scope.dvdList = Dvd.DvdList.getAllDvd( function()
        {
            if( $scope.dvdList.success )
            {
                console.log('DVD got successfully');
                console.log($scope.dvdList.dvdList);
                $scope.dvdList = $scope.dvdList.dvdList;
            }
            else
            {
                console.log('Error when getting the DVD list');
            }
        } );

        // This value must have the same name in the html view to set the default filter
        $scope.orderProp = 'age';

        /**
         * Redirection into the add DVD html page.
         */
        $scope.addDvd = function () {
            $location.url('/addDvd');
        };
    }
]);

/**
 * DVD Details controllers.
 */
dvdCatControllers.controller('DvdDetailCtrl', ['$scope', '$routeParams', 'Dvd',
    function ($scope, $routeParams, Dvd) {
        console.log('Dvd Details controller');

        // Method with our service
//        $scope.dvd = Dvd.DvdList.get({dvdId: $routeParams.dvdId}, function (dvd) {
//            $scope.mainImageUrl = dvd.images[0];
//        });

        // We get the DVD
        $scope.dvdSearch = Dvd.DvdDetails.getDvd( {dvd: $routeParams.dvdId}, function()
        {
            if( $scope.dvdSearch.success )
            {
                console.log('DVD got successfully');
                $scope.dvd = $scope.dvdSearch.dvd[0];
                $scope.mainImageUrl = $scope.dvd.moviePoster;
            }
            else
            {
                console.log('Error when getting the DVD list');
            }
        } );

        $scope.setImage = function (imageUrl) {
            $scope.mainImageUrl = imageUrl;
        }
    }
]);

/**
 * Add DVD controllers.
 */
dvdCatControllers.controller('DvdAddCtrl', ['$scope', '$location', '$http', 'Dvd', 'MovieDB',
    function ($scope, $location, $http, Dvd, MovieDB) {
        console.log('Dvd Add controller');

        // The MovieDB request to get movie information.
        $scope.requests = {
            movieDBKey: '37c2294ca3753bd14d165eda4b3f9314',
            movieID: 'https://api.themoviedb.org/3/search/movie?api_key=VAR_API_KEY&query=VAR_QUERY&language=VAR_LANGUAGE&callback=JSON_CALLBACK',
            movieDetails: 'https://api.themoviedb.org/3/movie/VAR_QUERY?api_key=VAR_API_KEY&language=VAR_LANGUAGE&callback=JSON_CALLBACK',
            movieImagesPath: 'https://api.themoviedb.org/3/movie/VAR_QUERY/images?api_key=VAR_API_KEY&language=VAR_LANGUAGE&callback=JSON_CALLBACK',
            movieStaff: 'https://api.themoviedb.org/3/movie/VAR_QUERY/credits?api_key=VAR_API_KEY&language=VAR_LANGUAGE&callback=JSON_CALLBACK',
            peopleID: 'https://api.themoviedb.org/3/search/person?api_key=VAR_API_KEY&query=VAR_QUERY&language=VAR_LANGUAGE&callback=JSON_CALLBACK',
            peopleDetails: 'https://api.themoviedb.org/3/person/VAR_QUERY?api_key=VAR_API_KEY&language=VAR_LANGUAGE&callback=JSON_CALLBACK',
            peopleImagesPath: 'https://api.themoviedb.org/3/person/VAR_QUERY/images?api_key=VAR_API_KEY&language=VAR_LANGUAGE&callback=JSON_CALLBACK',
            images: 'http://image.tmdb.org/t/p/w500VAR_QUERY'
        };

        // The different movie genres.
        $scope.genres = {
            action: 'Action',
            adventure: 'Aventure',
            animation: 'Animation',
            comedy: 'Comédie',
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

        // Initialize the DVD form.
        $scope.dvd = {
            searchError: false,
            temporaryMoviePosterName: 'temporaryImg.jpg',
            title: '',
            moviePoster: '',
            genre: $scope.genres.action,
            releaseDate: '',
            overview: '',
            productionCompanies: '',
            director: '',
            actors: [ {name: ''}]
        };

        // Initialize the dynamic popover when the user search a movie not recorder in the movieDB.
        $scope.dynamicFindPopoverStatus = {
            error: 'Le film n\'est pas répertorié',
            success: 'Le film à été trouvé'
        };
        $scope.dynamicFindPopover = $scope.dynamicFindPopoverStatus.success;
        $scope.dynamicFindPopoverPlacement = 'right';
        $scope.dynamicFindPopoverTrigger = 'focus';

        // Initialize the dynamic popover when the user save a movie already recorder in the database.
        $scope.dynamicSavePopoverStatus = {
            error: 'Le film est déjà répertorié',
            success: 'Le film a été sauvegardé'
        };
        $scope.dynamicSavePopover = $scope.dynamicSavePopoverStatus.success;
        $scope.dynamicSavePopoverPlacement = 'bottom';
        $scope.dynamicSavePopoverTrigger = 'focus';     // Primary it's "click"

        /**
         * Redirection into the index html page.
         */
        $scope.cancelAddDvd = function () {
            $location.url('/dvd');
        };

        /**
         * Add a new Actor.
         */
        $scope.addInputActor = function(actor){
            // The boolean which permit to check if an empty field exist
            var isExist = false;

            // We check if an empty field alreayd exist
            for (var actorID in $scope.dvd.actors) {
                if($scope.dvd.actors[actorID].name == '')
                    isExist = true;
            }

            // If no field are empty, we add a new input field
            if(!isExist) {
                $scope.dvd.actors.push( {name: ''} );
            }
        }

        /**
         * Delete the current Actor.
         * @param actor: The actor to delete
         */
        $scope.deleteThisActor = function(actor){
            // We decrement the length for the ng-repeat, and we delete the actor value
            $scope.dvd.actors.length -= 1;
            delete $scope.dvd.actors[actor];
        };

        /**
         * Get the movie information to fill out the DVD structure.
         */
        $scope.checkMovieInformation = function () {
            console.log('Checking movie data: ' + $scope.dvd.title);

            // We get the movie ID
            var dvdID = MovieDB.GetMovieID.request({ apiKeyVar: $scope.requests.movieDBKey, queryVar: $scope.dvd.title, languageVar: 'fr' },
                function success() {
                    // This callback will be called asynchronously when the response is available
                    if(dvdID.results.length > 0) {
                        console.log('Movie ID got from internet');
                        console.log(dvdID);

                        // We set the popover message and the class button OK
                        $scope.dvd.searchError = false;
                        $scope.dynamicFindPopover = $scope.dynamicFindPopoverStatus.success;

                        // Set the movie poster url and the movie title.
                        $scope.dvd.title = dvdID.results[0].title;
                        if(dvdID.results[0].poster_path != undefined && dvdID.results[0].poster_path != null) {
                            $scope.dvd.moviePoster = 'img/' + $scope.dvd.title + '.jpg';
                            $scope.moviePoster = $scope.requests.images.replace('VAR_QUERY', dvdID.results[0].poster_path);

                            // We pre-saved the movie poster to win time (avoid time problem when the user saved it's DVD and it's relocated in the "/dvd" route)
                            var saveImage = Dvd.DvdAdd.saveImage({uri: $scope.moviePoster, filename: $scope.dvd.temporaryMoviePosterName}, function () {
                                if (saveImage.success) {
                                    console.log('Image successfully saved');
                                }
                                else {
                                    console.log("Error when saved the image");
                                }
                            });
                        }

                        // If an ID is founded, we can get the movie details
                        var dvdDetails = MovieDB.GetMovieDetails.request({ queryVar: dvdID.results[0].id, apiKeyVar: $scope.requests.movieDBKey, languageVar: 'fr' },
                            function success() {
                                // This callback will be called asynchronously when the response is available
                                console.log('Movie details got from internet');
                                console.log(dvdDetails);

                                // We fill out the movies form
                                if(dvdDetails.genres.length > 0 ) {
                                    var genreExist = false;

                                    // We check if the genre exist in our list
                                    for(var genreID in $scope.genres) {
                                        if($scope.genres[genreID] == dvdDetails.genres[0].name) {
                                            genreExist = true;
                                        }
                                    }

                                    // If the genre exist, we display it, else we set '' to disable "save" button in "add-dvd" view
                                    genreExist ? $scope.dvd.genre = dvdDetails.genres[0].name : $scope.dvd.genre = '';
                                }

                                console.log($scope.dvd.genre);
                                $scope.dvd.releaseDate = dvdDetails.release_date;
                                $scope.dvd.overview = dvdDetails.overview;
                                $scope.dvd.productionCompanies = '';

                                for (var productionCompanyID in dvdDetails.production_companies) {
                                    $scope.dvd.productionCompanies += dvdDetails.production_companies[productionCompanyID].name + ', ';
                                }
                            },
                            function err() {
                                // Called asynchronously if an error occurs or server returns response with an error status.
                                console.log('Error when getting the movie details from internet');
                            });

                        // If an ID is founded, we can get the movie cast
                        var dvdCast = MovieDB.GetMovieCast.request({ queryVar: dvdID.results[0].id, apiKeyVar: $scope.requests.movieDBKey, languageVar: 'fr' },
                            function success() {
                                // This callback will be called asynchronously when the response is available
                                console.log('Movie cast got from internet');
                                console.log(dvdCast);

                                // We fill out the movies form
                                if(dvdCast.crew.length > 0) {
                                    $scope.dvd.director = dvdCast.crew[0].name;
                                }
                                $scope.dvd.actors = [];

                                // If the list isn't empty
                                if(dvdCast.cast.length > 5) {
                                    for (var i = 0; i < 5; i++) {
//                                        $scope.dvd.actors += dvdCast.cast[i].name + ', ';
                                        $scope.dvd.actors.push( {name: dvdCast.cast[i].name + ' (' + dvdCast.cast[i].character + ')'} );
                                    }
                                }

                                else {
                                    for (var i = 0; i < dvdCast.cast.length; i++) {
//                                        $scope.dvd.actors += dvdCast.cast[i].name + ', ';
                                        $scope.dvd.actors.push( {name: dvdCast.cast[i].name + ' (' + dvdCast.cast[i].character + ')'} );
                                    }
                                }
                            },
                            function err() {
                                // Called asynchronously if an error occurs or server returns response with an error status.
                                console.log('Error when getting the movie cast from internet');
                            });
                    }

                    else {
                        console.log('The movie ID is not listed');

                        // We set the popover message and the class button error
                        $scope.dvd.searchError = true;
                        $scope.dynamicFindPopover = $scope.dynamicFindPopoverStatus.error;
                    }
                },
                function err() {
                    // Called asynchronously if an error occurs or server returns response with an error status.
                    console.log('Error when getting the movie ID from internet');

                    // We set the popover message and the class button error
                    $scope.dvd.searchError = true;
                    $scope.dynamicFindPopover = $scope.dynamicFindPopoverStatus.error;
                });
        };

        /**
         * Save the new DVD in the database.
         */
        $scope.performSave = function () {
            // We check if a DVD already exist in the database
            var check = Dvd.DvdAdd.isDvdExist({dvd: $scope.dvd.title}, function () {
                if (check.success) {
                    console.log('DVD already exist');

                    // We notify to the user that the save failed because the DVD already exist
                    $scope.dynamicSavePopover = $scope.dynamicSavePopoverStatus.error;
                }
                else {
                    // We save the movie poster
                    var renamedImage = Dvd.DvdAdd.renameImage({temporaryFilename: $scope.dvd.temporaryMoviePosterName, filename: $scope.dvd.title + '.jpg'}, function () {
                        if (renamedImage.success) {
                            console.log('Image successfully renamed');

                            // We save the DVD in the database
                            var dvd = Dvd.DvdAdd.saveDvd({dvd: $scope.dvd}, function () {
                                if (dvd.success) {
                                    console.log('DVD added successfully');
                                }
                                else {
                                    console.log("Error when added the DVD");
                                }
                            });

                            // We notify to the user that the save performed
                            $scope.dynamicSavePopover = $scope.dynamicSavePopoverStatus.success;

                            // We redirect to the index view
                            $location.url('/dvd');
                        }
                        else {
                            console.log("Error when saved the image");
                        }
                    });
                }
            });
        };

//        var dvdList = Dvd.DvdAdd.getAllDvd( function()
//        {
//            if( dvdList.success )
//            {
//                console.log('DVD got successfully');
//                console.log(dvdList.dvdList);
//                //$location.url('/dvd');
//            }
//            else
//            {
//                console.log('Error when getting the DVD list');
//            }
//        } );

//        var dvd = Dvd.DvdAdd.getDvd( {dvd: 'Avatar'}, function()
//        {
//            if( dvd.success )
//            {
//                console.log('DVD got successfully');
//                console.log(dvd.dvd[0]);
//                //$location.url('/dvd');
//            }
//            else
//            {
//                console.log("Error when getting the DVD");
//            }
//        } );

//        var dvd = Dvd.DvdAdd.isDvdExist({dvd: 'Avatar'}, function () {
//            if (dvd.success) {
//                console.log('DVD exist');
//            }
//            else {
//                console.log('Error when checking the DVD');
//            }
//        });

        // To display image canvas
//        var canvas = document.getElementById('imageCanvas');
//        var context = canvas.getContext('2d');
//        var imageObj = new Image();
//
//        imageObj.onload = function() {
//            context.drawImage(imageObj, 0, 0);
//            context.lineWidth = 2;
//            context.strokeStyle = "black";
//            context.strokeRect(0, 0, 500, 500);
//        };
//        imageObj.src = 'http://image.tmdb.org/t/p/w500/nzN40Eck9q6YbdaNQs4pZbMKsfP.jpg';

    }]
)
;