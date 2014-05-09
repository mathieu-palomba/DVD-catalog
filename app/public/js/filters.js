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
    return function (data, currentMovieFormat, movieFormats, showAll) {
        console.log('plop');
        console.log(data);
        var result = data.slice(0); // copy array

        angular.forEach(movieFormats, function(value, key) {
            for(var index = 0; index < result.length; index++) {
                console.log('for')
                var dvd = result[index];

                if (dvd.movieFormat != currentMovieFormat && currentMovieFormat != showAll) {
                    console.log('Delete')
                    console.log(result[index])
                    result.splice(index--, 1);
                }
            }
        });

        return result;
    };
});

dvdCatFilter.filter('dvdGenresFilter', function() {
    return function(items, dvdGenres, selectedItems) {
        console.log('Dvd genres filter');
        console.log(dvdGenres)
        var result = items.slice(0); // copy array

        angular.forEach(selectedItems, function(value, key) {
            console.log('For each')
            console.log(value)
            var genre = dvdGenres[value];
            console.log(genre)
            if(genre.assignable) {
                for(var index = 0; index < result.length; index++) {
                    var dvd = result[index];
                    var isGenreMatch = false;

                    angular.forEach(dvd.genres, function(value, key) {
                        console.log('2nd for each')
                        isGenreMatch = isGenreMatch | dvd.genres[key].name == genre.name;
                    });

                    if(!isGenreMatch) {
                        result.splice(index--, 1);
                    }
                }
            }
        });

        return result;
    };
});