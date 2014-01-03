/**
 * Controllers.
 */
var dvdCatControllers = angular.module('dvdCatControllers', []);

/**
 * DVD List controllers.
 */
dvdCatControllers.controller('DvdListCtrl', ['$scope', '$location', 'Dvd', 'GetMovieData',
    function ($scope, $location, Dvd, GetMovieData) {
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
        $scope.phone = Dvd.DvdList.get({dvdId: $routeParams.dvdId}, function (phone) {
            $scope.mainImageUrl = phone.images[0];
        });

        $scope.setImage = function (imageUrl) {
            $scope.mainImageUrl = imageUrl;
        }
    }
]);

/**
 * Add DVD controllers.
 */
dvdCatControllers.controller('DvdAddCtrl', ['$scope', '$location', 'Dvd',
    function ($scope, $location, Dvd) {
        console.log("Dvd Add controller");

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

        $scope.dvd = {
            name: '',
            genre: $scope.genres.action,
            releaseDate: '',
            overview: '',
            actors: null
        };


        /**
         * Save the new DVD in the database.
         */
        $scope.performSave = function () {
            var dvd = Dvd.DvdAdd.saveDvd( {dvd: $scope.dvd}, function()
            {
                if( dvd.success )
                {
                    console.log("DVD added successfully");
                    $location.url('/dvd');
                }
                else
                {
                    console.log("Error when added the DVD");
                }
            } );

        };

        /**
         * Redirection into the index html page.
         */
        $scope.cancelAddPhone = function () {
            $location.url('/dvd');
        };

        var dvd = Dvd.DvdAdd.getAllDvd( function()
        {
            if( dvd.success )
            {
                console.log("DVD got successfully");
                console.log(dvd.dvd);
                //$location.url('/dvd');
            }
            else
            {
                console.log("Error when getting the DVD list");
            }
        } );

//        var dvd = Dvd.DvdAdd.getDvd( {dvd: 'avatar'}, function()
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
    }]
)
;