/**
 * Animation services.
 */
var dvdCatAnimations = angular.module('dvdCatAnimations', ['ngAnimate']);

/**
 * Animation when the user click/mouse enter in the thumbnails.
 */
dvdCatAnimations.animation('.phone', function () {
    return {
        addClass: function (element, className, done) {
            if (className != 'active') {
                return;
            }
            element.css({
                position: 'absolute',
                top: 500,
                left: 0,
                display: 'block'
            });
            jQuery(element).animate({
                top: 0
            }, done);

            // This is an optional function that's called when the animation is cancelled
            return function (cancel) {
                if (cancel) element.stop();
            };
        },
        removeClass: function (element, className, done) {
            if (className != 'active') return;
            element.css({
                position: 'absolute',
                left: 0,
                top: 0
            });
            jQuery(element).animate({
                top: -500
            }, done);

            // This is an optional function that's called when the animation is cancelled
            return function (cancel) {
                if (cancel) element.stop();
            };
        }
    };
});