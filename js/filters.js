/**
 * Filters.
 */
var phonecatFilter = angular.module('phonecatFilters', []);

/**
 * This filter evaluate a boolean an return the corresponding unicode character.
 */
phonecatFilter.filter('checkmark', function() {
    return function(input) {
        return input ? '\u2713' : '\u2718';
    };
});