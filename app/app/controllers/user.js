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
//    login: passport.authenticate('local', {
//        successRedirect: '/user/login/success',
//        failureRedirect: '/user/login/failure',
//        failureFlash: "Nom d'utilisateur ou mot de passe incorrect"     // You can set you're error message here if you don't want to user the "new LocalStrategy" error message in the return done function (else set to true)
//    }),
    login: function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            // Request error
            if (err) {
                return next(err);
            }

            // User isn't authenticated
            if (!user) {
                req.session.messages =  [info.message];
                return res.redirect('/login');
            }

            // User successfully log
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.redirect('/login/success');
            });

        })(req, res, next);
    },

    /**
     * On Login Success callback.
     * @param req : The request
     * @param res : The response
     */
    loginSuccess: function(req, res){
        console.log('login success');

//        res.json({
//            success: true,
//            user: req.session.passport.user
//        });

        // If the user it's log, we redirect it to the main page
        res.redirect('/dvd');
    },

    /**
     * On Login Failure callback.
     * @param req : The request
     * @param res : The response
     */
    loginFailure: function(req, res){
        console.log('login failure');

        // We create an user
//        User.create({'username': 'mathieu', 'email': 'mathieu@mathieu.fr', 'password': 'root', 'isAdmin': true}, function(err){
//            if (err) {
//                console.log(err);
//                return;
//            }
//
//            else {
//                console.log('User created');
//            }
//        });
//
//        User.create({'username': 'julie', 'email': 'julie@julie.fr', 'password': 'root'}, function(err){
//            if (err) {
//                console.log(err);
//                return;
//            }
//
//            else {
//                console.log('User created');
//            }
//        });
//        User.create({'username': 'sylvain', 'email': 'sylvain@sylvain.fr', 'password': '12345'}, function(err){
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

        // If the user isn't log, we redirect it to the sign in page
        res.render( 'login', {
            message: req.session.messages
        } );
    },

    /**
     * Log out a user.
     * @param req : The request
     * @param res : The response
     */
    logout: function(req, res) {
        console.log('Logout');

        req.logout();
        res.end();
        res.redirect('/');
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

        console.log('Not authenticated');
        // If the user isn't authenticated, we redirect it to '/'
        res.redirect('/');
    },

    /**
     * Check for admin middleware, this is unrelated to passport.js.
     * @param req : The request
     * @param res : The response
     * @param next: The next step
     */
    ensureAdmin: function ensureAdmin(req, res, next) {
        console.log('Ensure admin');
        console.log(req.user);

        // If the user it's an admin, we call the next method
        if(req.user && req.user.isAdmin === true) {
            return next();
        }

        // Else, we redirect into the home page
        res.redirect('/');
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
     * Get the current user.
     * @param req : The request
     * @param res : The response
     */
    currentUser: function( req, res )
    {
        res.jsonp({"success": true, "user": req.user || null});
    },

    /**
     * Get all of the users registered.
     * @param req : The request
     * @param res : The response
     */
    getUsers: function(req, res)
    {
        console.log("Find users");

        // Find the users
        User.find(null, function (err, users) {
            if (err) {
                return handleError(err);
            }

            else {
                if(users) {
                    console.log('Users found');
                    res.jsonp({"success": true, users: users});
                }

                else {
                    console.log('Users not found');
                    res.jsonp({"success": false});
                }
            }
        });
    }

};

exports = module.exports = AuthController;