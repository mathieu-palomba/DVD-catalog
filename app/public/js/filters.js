/**
 * Filters.
 */
var dvdCatFilter = angular.module('dvdCatFilter', []);

/**
 * This filter evaluate a boolean an return the corresponding unicode character.
 */
dvdCatFilter.filter('checkmark', function() {
    return function(input) {
        return input ? '\u2713' : '\u2718';
    };
});

/**
 * Filter to display only maxLength characters for the DVD overview.
 */
dvdCatFilter.filter('overviewMaxLength', function() {
        return function(overview) {
            var maxLength = 1000;
            return overview.length > maxLength ? overview.substr(0, maxLength) + '...' : overview;
        };
    }
);

/**
 * Filter to display the DVD genre in once line.
 */
dvdCatFilter.filter('dvdGenreInline', function() {
        return function(genres) {
            var genresToString = "";

            for(var genreID in genres) {
                var concat = '';
                genreID == genres.length-1 ? concat = '' : concat = ', ';

                genresToString += genres[genreID].name + concat;
            }

            return genresToString;
        };
    }
);

/**
 * This filter display the date with a french format.
 */
dvdCatFilter.filter('dateFormat', function() {
    return function(date) {
        return date.toDateString();
    };
});


/**
 * This filter permit to filter the movies with the movie format attribute.
 */
dvdCatFilter.filter('movieFormatFilter', function() {
    return function (items, dvdFormats) {
//        console.log('Dvd formats filter')
        var result = [];

        // Try catch to avoid error like 'interpolation error'
        try {
            if (items != undefined) {
    //            console.log(items)
                var result = items.slice(0); // copy array
        //        console.log('dvdFormats')
        //        console.log(dvdFormats)
        //        console.log('items')
        //        console.log(items)

                angular.forEach(dvdFormats, function(value, key) {
        //            console.log('Format')
        //            console.log(format)
                    var format = value;

                    if(format.assignable) {
                        for(var index = 0; index < result.length; index++) {
                            var dvd = result[index];
                            var isFormatMatch = false;
        //                    console.log('dvd')
        //                    console.log(dvd)
        //                    console.log('movie format')
        //                    console.log(dvd.movieFormat)

                            isFormatMatch = isFormatMatch | dvd.movieFormat == format.name;

                            if(!isFormatMatch) {
                                result.splice(index--, 1);
                            }
                        }
                    }
                });

                return result;
            }
        }
        catch (e) {
            return result;
        }
}});


/**
 * This filter permit to filter the movies with the movie genres attribute.
 */
dvdCatFilter.filter('dvdGenresFilter', function() {
    return function(items, dvdGenres) {
        var result = items.slice(0); // copy array

        // For each genres in the dropdowns menu, we check if the checkbox it's enabled
        angular.forEach(dvdGenres, function(value, key) {
            var genre = value;

            // If the checkbox it's enabled, we look over the dvd list
            if(genre.assignable) {
                for(var index = 0; index < result.length; index++) {
                    var dvd = result[index];
                    var isGenreMatch = false;

                    // We search if the dvd contains the genre filter
                    angular.forEach(dvd.genres, function(value, key) {
                        isGenreMatch = isGenreMatch | dvd.genres[key].name == genre.name;
                    });

                    // If the filter isn't in the dvd genres, we delete the dvd from the display list
                    if(!isGenreMatch) {
                        result.splice(index--, 1);
                    }
                }
            }
        });

        return result;
    };
});