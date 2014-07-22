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
    return function (items, dvdFormatsFilter) {
        var result = [];

        // Try catch to avoid error like 'interpolation error'
        try {
            var result = items.slice(0); // copy array

            // For each dvd, we check if it contain at least one genre
            angular.forEach(result, function(value, key) {
                var dvd = value;

                // We compute the length of common element
                var movieFormatMatch = _.indexOf(dvdFormatsFilter, dvd.movieFormat);

                // If the index of the current movie format isn't greater than -1, AND if the array of movie formats filter isn't empty, we remove the current dvd from the list
                if(dvdFormatsFilter.length > 0 && !(movieFormatMatch > -1)) {
                    result = _.without(result, _.findWhere(result, {title: dvd.title}));
                }
            });

            return result;
        }
        catch (e) {
            return result;
        }
}});


/**
 * This filter permit to filter the movies with the movie genres attribute.
 */
dvdCatFilter.filter('dvdGenresFilter', function(_) {
    return function(items, genreNamesFilter) {
        var result = []

        // Try catch to avoid error like 'interpolation error'
        try {
            var result = items.slice(0); // copy array

            // For each dvd, we check if it contain at least one genre
            angular.forEach(result, function(value, key) {
                var dvd = value;

                // We compute the array of genre names
                var dvdGenreNames = _.chain(dvd.genres)
                                        .map(function(obj){
                                            return obj.name;
                                        })
                                        .value();

                // We compute the length of common element
                var dvdLengthInCommon = _.intersection(genreNamesFilter, dvdGenreNames).length;

                // If the length of the common elements array isn't greater than one, AND if the array of genres filter isn't empty, we remove the current dvd from the list
                if(genreNamesFilter.length > 0 && !(dvdLengthInCommon >= 1)) {
                    result = _.without(result, _.findWhere(result, {title: dvd.title}));
                }
            });

            return result;
        }
        catch (e) {
            return result;
        }
    };
});