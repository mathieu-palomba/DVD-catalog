module.exports = function( app )
{
    // Home route
    var portal = require( '../app/controllers/portal' );
    app.get( '/', portal.portal );

    // Dvd routes
    var dvd = require( '../app/controllers/dvd' );
    app.post( '/addDvd/save', dvd.create );
    app.get( '/getDvd/:dvd', dvd.getDvd );
    app.get( '/getAllDvd', dvd.getAllDvd );
    app.get( '/isDvdExist/:dvd', dvd.isDvdExist );

};
