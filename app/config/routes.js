module.exports = function( app )
{
    //Home route
    var portal = require( '../app/controllers/portal' );
    app.get( '/portal/:num', portal.portal );

};
