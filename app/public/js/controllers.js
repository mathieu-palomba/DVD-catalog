/**
 * Controllers.
 */
var dvdCatControllers = angular.module('dvdCatControllers', []);

/**
 * DVD List controllers.
 */
dvdCatControllers.controller('DvdListCtrl', ['$scope', '$location', 'Dvd',
    function ($scope, $location, Dvd) {
        console.log("Dvd List controller");

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
        console.log("Dvd Details controller");

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
dvdCatControllers.controller('DvdAddCtrl', ['$scope', '$location', '$http', 'Dvd',
    function ($scope, $location, $http, Dvd) {
        console.log("Dvd Add controller");



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
            name: '',
            genre: $scope.genres.action,
            releaseDate: '',
            overview: '',
            productionCompanies: '',
            director: '',
            actors: null
        };

        /**
         * Redirection into the index html page.
         */
        $scope.cancelAddDvd = function () {
            $location.url('/dvd');
        };

        /**
         * Execute a JSONP request to get movie information from internet.
         * @param url: The requested url
         * @param movieDetails: The variable where the request result is set
         */
        $scope.getMovieInformation = function (url, movieDetails) {
            $http.jsonp(url).
                success(function (data, status, headers, config) {
                    // This callback will be called asynchronously when the response is available
                    console.log('Data got from internet');
                    console.log(data);
                    movieDetails = data;
                }).
                error(function (data, status, headers, config) {
                    // Called asynchronously if an error occurs or server returns response with an error status.
                    console.log('Error when getting the data from internet');
                    console.log(data);
                    movieDetails = null;
                });
        };

        /**
         * Save the new DVD in the database.
         */
        $scope.performSave = function () {
            var dvd = Dvd.DvdAdd.saveDvd({dvd: $scope.dvd}, function () {
                if (dvd.success) {
                    console.log("DVD added successfully");
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
//                console.log("DVD got successfully");
//                console.log(dvdList.dvdList);
//                //$location.url('/dvd');
//            }
//            else
//            {
//                console.log("Error when getting the DVD list");
//            }
//        } );

//        var dvd = Dvd.DvdAdd.getDvd( {dvd: 'Avatar'}, function()
//        {
//            if( dvd.success )
//            {
//                console.log("DVD got successfully");
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
                console.log("DVD exist");
            }
            else {
                console.log("Error when checking the DVD");
            }
        });

        // Set the movie poster url.
        $scope.moviePoster = 'http://image.tmdb.org/t/p/w500/nzN40Eck9q6YbdaNQs4pZbMKsfP.jpg';

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