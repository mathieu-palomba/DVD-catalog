module.exports = function( app )
{
    // Login routes
    var user = require( '../app/controllers/user' );
    app.get( '/', user.signIn );
    app.post('/user/login', user.login);
    app.get('/user/logout', user.ensureAuthenticated, user.logout);
    app.get('/user/login/success', user.loginSuccess);
    app.get('/user/login/failure', user.loginFailure);
    app.post('/user/register', user.register);

    // Home route
    var portal = require( '../app/controllers/portal' );
    app.get( '/dvd', user.ensureAuthenticated, portal.portal );

    // Dvd routes
    var dvd = require( '../app/controllers/dvd' );
    app.post( '/addDvd/saveDvd', user.ensureAuthenticated, dvd.create );
    app.post( '/dvd/deleteDvd', user.ensureAuthenticated, dvd.delete );
    app.post( '/dvd/editDvd', user.ensureAuthenticated, dvd.edit );
    app.post( '/addDvd/saveImage', user.ensureAuthenticated, dvd.saveImage );
    app.post( '/addDvd/renameImage', user.ensureAuthenticated, dvd.renameImage );
    app.get( '/getDvd/:dvd', user.ensureAuthenticated, dvd.getDvd );
    app.get( '/getAllDvd', user.ensureAuthenticated, dvd.getAllDvd );
    app.get( '/isDvdExist/:dvd', user.ensureAuthenticated, dvd.isDvdExist );

};
