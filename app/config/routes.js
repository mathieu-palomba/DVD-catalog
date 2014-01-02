module.exports = function( app )
{
    //Home route
    var portal = require( '../app/controllers/portal' );
    app.get( '/', portal.portal );

    // Dvd routes
    var dvd = require( '../app/controllers/dvd' );
    app.post( '/addPhone/save', dvd.create );

};
