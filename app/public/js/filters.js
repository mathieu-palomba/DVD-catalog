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