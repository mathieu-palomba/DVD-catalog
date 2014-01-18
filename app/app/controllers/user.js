/**
 * Module dependencies.
 */
var passport = require('passport'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'); // The model we defined in the previous example

var AuthController = {

    /**
     * The sign in view.
     * @param req : The request
     * @param res : The response
     */
    signIn: function (req, res) {
        console.log('Sing in');

        res.render('login');
    },

    /**
     * Login a user.
     * @param req : The request
     * @param res : The response
     */
    login: passport.authenticate('local', {
        successRedirect: '/user/login/success',
        failureRedirect: '/user/login/failure',
        failureFlash: "Nom d'utilisateur ou mot de passe incorrect"                          // You can set you're error message here if you don't want to user the "new LocalStrategy" error message in the return done function (else set to true)
    }),

    /**
     * On Login Success callback.
     * @param req : The request
     * @param res : The response
     */
    loginSuccess: function(req, res){
        console.log('login success');

        res.json({
            success: true,
            user: req.session.passport.user
        });

        res.redirect( '/dvd' );
    },

    /**
     * On Login Failure callback.
     * @param req : The request
     * @param res : The response
     */
    loginFailure: function(req, res){
        console.log('login failure');

        // We create an user
//        User.create({'username': 'mathieu', 'email': 'mathieu@mathieu.fr', 'password': 'root'}, function(err){
//            if (err) {
//                console.log(err);
//                return;
//            }
//
//            else {
//                console.log('User created');
//            }
//        });

//        res.json({
//            success:false,
//            message: 'Invalid username or password.'
//        });

//        res.redirect( '/' );

        res.render( 'login', {
            message: req.flash( 'error' )
        } );
    },

    /**
     * Log out a user.
     * @param req : The request
     * @param res : The response
     */
    logout: function(req, res){
        console.log('Logout');

        req.logout();
        res.end();

        res.redirect( '/' );
    },

    /**
     * Ensure that user it's authenticated.
     * @param req : The request
     * @param res : The response
     */
    ensureAuthenticated: function(req, res, next) {
        console.log('Ensure authenticated');

        if (req.isAuthenticated()) {
            return next();
        }

//        res.redirect( '/' );
        res.render( 'login' );
    },

    /**
     * Register a user.
     * @param req : The request
     * @param res : The response
     */
    register: function(req, res){
        console.log('Create user');

//        User.create({name: req.body.name, email: req.body.email, password: req.body.password}, function(err){
//            if (err) {
//                console.log(err);
//                res.redirect('/* Your error redirection path */');
//                return;
//            }
//
//            res.redirect('/* Your success redirection path */');
//        });
    },

    /**
     * Send the current user.
     * @param req : The request
     * @param res : The response
     */
    currentUser: function( req, res )
    {
        res.jsonp( req.user || null );
    }

};

exports = module.exports = AuthController;