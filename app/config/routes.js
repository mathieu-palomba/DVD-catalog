module.exports = function (app) {
    // Login routes
    var user = require('../app/controllers/user');
    app.get('/', user.signIn);
    app.post('/login', user.login);
    app.get('/user/logout', user.ensureAuthenticated, user.logout);
    app.get('/login', user.loginFailure);
    app.get('/login/success', user.loginSuccess);
    app.post('/user/register', user.register);
    app.get('/user/currentUser', user.ensureAuthenticated, user.currentUser);
    app.get('/user/users', user.ensureAdmin, user.getUsers);

    // Home route
    var portal = require('../app/controllers/portal');
    app.get('/dvd', user.ensureAuthenticated, portal.portal);

    // Dvd routes
    var dvd = require('../app/controllers/dvd');
    app.post('/addDvd/saveDvd', user.ensureAuthenticated, dvd.create);
    app.post('/dvd/deleteDvd', user.ensureAuthenticated, dvd.delete);
    app.post('/dvd/editDvd', user.ensureAuthenticated, dvd.edit);
    app.post('/addDvd/saveImage', user.ensureAuthenticated, dvd.saveImage);
    app.post('/addDvd/renameImage', user.ensureAuthenticated, dvd.renameImage);
    app.get('/getDvd/:dvdTitle&:userName', user.ensureAuthenticated, dvd.getDvd);
    app.get('/getAllDvd', user.ensureAuthenticated, dvd.getAllDvd);
    app.get('/isDvdExist/:dvdTitle', user.ensureAuthenticated, dvd.isDvdExist);
    app.get('/owner', user.ensureAuthenticated, dvd.getCurrentOwner);
    app.get('/owner/:userName', user.ensureAuthenticated, dvd.getOwner);
    app.get('/owners', user.ensureAdmin, dvd.getOwners);

};
