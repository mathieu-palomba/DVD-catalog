module.exports = function( app )
{
    // Login routes
    var user = require( '../app/controllers/user' );
    app.get( '/', user.signIn );
    app.post('/user/login', user.login);
    app.post('/user/logout', user.logout);
    app.get('/user/login/success', user.loginSuccess);
    app.get('/user/login/failure', user.loginFailure);
    app.post('/user/register', user.register);

    // Home route
    var portal = require( '../app/controllers/portal' );
    app.get( '/dvd', portal.portal );

    // Dvd routes
    var dvd = require( '../app/controllers/dvd' );
    app.post( '/addDvd/saveDvd', dvd.create );
    app.post( '/dvd/deleteDvd', dvd.delete );
    app.post( '/dvd/editDvd', dvd.edit );
    app.post( '/addDvd/saveImage', dvd.saveImage );
    app.post( '/addDvd/renameImage', dvd.renameImage );
    app.get( '/getDvd/:dvd', dvd.getDvd );
    app.get( '/getAllDvd', dvd.getAllDvd );
    app.get( '/isDvdExist/:dvd', dvd.isDvdExist );

};
