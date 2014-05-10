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
//        console.log('plop');
//        console.log(data);
//        var result = data.slice(0); // copy array
//
//        angular.forEach(movieFormats, function(value, key) {
//            for(var index = 0; index < result.length; index++) {
//                console.log('for')
//                var dvd = result[index];
//
//                if (dvd.movieFormat != currentMovieFormat && currentMovieFormat != showAll) {
//                    console.log('Delete')
//                    console.log(result[index])
//                    result.splice(index--, 1);
//                }
//            }
//        });
//
//        return result;
        console.log('Dvd formats filter');
        var result = items.slice(0); // copy array
        console.log('dvdFormats')
        console.log(dvdFormats);
        console.log('items')
        console.log(items);

        angular.forEach(dvdFormats, function(value, key) {
            console.log('Format')
            console.log(format)
            var format = value;

            if(format.assignable) {
                for(var index = 0; index < result.length; index++) {
                    var dvd = result[index];
                    var isFormatMatch = false;
                    console.log('dvd')
                    console.log(dvd)
                    console.log('movie format')
                    console.log(dvd.movieFormat)

//                    angular.forEach(dvd.movieFormat, function(value, key) {
//                        isFormatMatch = isFormatMatch | dvd.movieFormat[key].name == format.name;
//                    });
                    isFormatMatch = isFormatMatch | dvd.movieFormat == format.name;

                    if(!isFormatMatch) {
                        result.splice(index--, 1);
                    }
                }
            }
        });

        return result;
    };
});

dvdCatFilter.filter('dvdGenresFilter', function() {
    return function(items, dvdGenres) {
        console.log('Dvd genres filter');
        var result = items.slice(0); // copy array
        console.log('items')
        console.log(items)
        console.log('selected dvd genres')
        console.log('dvd genres');
        console.log(dvdGenres)

        angular.forEach(dvdGenres, function(value, key) {
            console.log('value - key')
            console.log(value)
            console.log(key)
            var genre = value;
            console.log('genre')
            console.log(genre)
            if(genre.assignable) {
                for(var index = 0; index < result.length; index++) {
                    var dvd = result[index];
                    var isGenreMatch = false;
                    console.log('dvd genre')
                    console.log(dvd.genres[key])

                    angular.forEach(dvd.genres, function(value, key) {
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