module.exports = function (app) {
    // Maintenance module
//    var path = require('path');
//    var maintenance = require('maintenance');
//    var options = {
//        current: true,                                                         // current state, default **false**
//        view: path.resolve(__dirname, '../app/views/', 'maintenance.ejs')       // view to render on maintenance, default **'maintenance.html'**
//    };

    // Login routes
    var user = require('../app/controllers/user');

    // MAINTENANCE
//    app.get('*', function (req, res) {
//        res.render('maintenance');
//    });
//    maintenance(app, options);
    // END MAINTENANCE

    app.get('/', user.signIn);
    app.post('/login', user.login);
    app.get('/signUp', user.signUp);
    app.post('/register', user.register);
    app.get('/user/logout', user.logout);
    app.get('/login', user.loginFailure);
    app.get('/login/success', user.loginSuccess);
    app.post('/user/register', user.register);
    app.get('/user/currentUser', user.ensureAuthenticated, user.currentUser);
    app.get('/user/users', user.ensureAdmin, user.getUsers);
    app.post('/updateCurrentUser', user.ensureAuthenticated, user.updateCurrentUser);
    app.post('/deleteCurrentUser', user.ensureAuthenticated, user.deleteCurrentUser);
    app.post('/deleteUser', user.ensureAdmin, user.deleteUser);
    app.post('/contact', user.ensureAuthenticated, user.sendContactMail);
    app.post('/updateCurrentUserPreferences', user.ensureAuthenticated, user.updateCurrentUserPreferences);
    app.post('/update', user.ensureAdmin, user.update);

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
    app.get('/getDvd/:dvdID&:userName', user.ensureAuthenticated, dvd.getDvd);
    app.get('/getAllDvd', user.ensureAuthenticated, dvd.getAllDvd);
    app.get('/isDvdExist/:dvdTitle&:releaseDate', user.ensureAuthenticated, dvd.isDvdExist);
    app.get('/owner', user.ensureAuthenticated, dvd.getCurrentOwner);
    app.get('/owner/:userName', user.ensureAuthenticated, dvd.getOwner);
    app.get('/owners', user.ensureAdmin, dvd.getOwners);
    app.post('/upload', user.ensureAuthenticated, dvd.uploadImage);
    app.post('/uploadBackupFile', user.ensureAuthenticated, dvd.uploadBackupFile);
    app.post('/updateCurrentOwner', user.ensureAuthenticated, dvd.updateCurrentOwner);
    app.post('/owner/deleteCurrentOwner', user.ensureAuthenticated, dvd.deleteCurrentOwner);
    app.post('/owner/deleteOwner', user.ensureAdmin, dvd.deleteOwner);
};
