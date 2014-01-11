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
 * Filter to display bar code three per three.
 */
dvdCatFilter.filter('overviewMaxLength', function() {
        return function(overview) {
            var maxLength = 1000;
            return overview.length > maxLength ? overview.substr(0, maxLength) + '...' : overview;
        };
    }
);