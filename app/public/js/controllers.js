/**
 * Controllers.
 */
var dvdCatControllers = angular.module('dvdCatControllers', ['ui.bootstrap']);

/**
 * DVD List controllers.
 */
dvdCatControllers.controller('DvdListCtrl', ['$scope', '$location', 'Dvd',
    function ($scope, $location, Dvd) {
        console.log('Dvd List controller');

        // Method with our service
        $scope.dvdList = Dvd.DvdList.query();

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
        $scope.dvd = Dvd.DvdList.get({dvdId: $routeParams.dvdId}, function (dvd) {
            $scope.mainImageUrl = dvd.images[0];
        });

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


        // The different movie genres.
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

        // Initialize the DVD form.
        $scope.dvd = {
            searchError: false,
            name: '',
            genre: $scope.genres.action,
            releaseDate: '',
            overview: '',
            productionCompanies: '',
            director: '',
            actors: null
        };

        // Initialize the dynamic popover when the user search a movie not recorder in the movieDB.
        $scope.dynamicPopoverPlacement = 'right';
        $scope.dynamicPopover = 'Le film n\'est pas répertorié';
        $scope.dynamicPopoverTrigger = 'focus';

        /**
         * Redirection into the index html page.
         */
        $scope.cancelAddDvd = function () {
            $location.url('/dvd');
        };

        /**
         * Get the movie information to fill out the DVD structure.
         */
        $scope.checkMovieInformation = function () {
            console.log('Checking movie data: ' + $scope.dvd.name);

            // We get the movie ID
            var product = MovieDB.getMovieID.request({ apiKeyVar: $scope.requests.movieDBKey, queryVar: $scope.dvd.name, languageVar: 'fr' },
                function success() {
                    // This callback will be called asynchronously when the response is available
                    if(product.results.length > 0) {
                        console.log('Movie got from internet');
                        console.log(product);

                        // We set the popover message and the class button OK
                        $scope.dvd.searchError = false;
                        $scope.dynamicPopover = 'Le film à été trouvé';

                        // Set the movie poster url.
                        $scope.moviePoster = $scope.requests.images.replace('VAR_QUERY', product.results[0].poster_path);
                    }

                    else {
                        console.log('The movie is not listed');

                        // We set the popover message and the class button error
                        $scope.dvd.searchError = true;
                        $scope.dynamicPopover = 'Le film n\'est pas répertorié';
                    }
                },
                function err() {
                    // Called asynchronously if an error occurs or server returns response with an error status.
                    console.log('Error when getting the data from internet');
                });


            // We can get the movie details
        };

        /**
         * Save the new DVD in the database.
         */
        $scope.performSave = function () {
            var dvd = Dvd.DvdAdd.saveDvd({dvd: $scope.dvd}, function () {
                if (dvd.success) {
                    console.log('DVD added successfully');
                    $location.url('/dvd');
                }
                else {
                    console.log("Error when added the DVD");
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

        var dvd = Dvd.DvdAdd.isDvdExist({dvd: 'Avatar'}, function () {
            if (dvd.success) {
                console.log('DVD exist');
            }
            else {
                console.log('Error when checking the DVD');
            }
        });

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