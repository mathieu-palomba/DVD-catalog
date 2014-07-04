/**
 * Module dependencies.
 */
var passport = require('passport'),
    mongoose = require('mongoose'),
    flash = require('express-flash'),
    Owner = mongoose.model('Owner'); // The model we defined in the previous example
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
                req.session.messages = [info.message];
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
//        User.create({'username': 'sylvain', 'email': 'sylvain@sylvain.fr', 'password': '12345', 'isAdmin': true}, function(err){
//            if (err) {
//                console.log(err);
//                return;
//            }
//
//            else {
//                console.log('User created');
//            }
//        });
//        User.create({'username': 'famille_fabre', 'email': 'fabre@fabre.fr', 'password': '12345'}, function(err){
//            if (err) {
//                console.log(err);
//                return;
//            }
//
//            else {
//                console.log('User created');
//            }
//        });
//        User.create({'username': 'kevin', 'email': 'kevin@kevin.fr', 'password': '12345', 'isAdmin': true}, function(err){
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
     * The sign up view.
     * @param req : The request
     * @param res : The response
     */
    signUp: function (req, res) {
        console.log('Sing Up');

        res.render('sign-up');
    },

    /**
     * Log out a user.
     * @param req : The request
     * @param res : The response
     */
    logout: function(req, res) {
        console.log('Logout');

//        req.logout();
//        res.end();
//        res.redirect('/');

        req.session.destroy(function () {
            res.redirect('/');
            res.end();

            console.log('logout OK')
        });
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

        var password = req.body.password
        var passwordRepeat = req.body.passwordRepeat

        // If the user enter the same password, we create the new user account
        if (password == passwordRepeat) {
            var user = new User( req.body );

            user.save( function( err )
            {
                console.log('User created')

                if( err )
                {
                    return res.render( 'sign-up', {
                        message: "Le nom d'utilisateur ou l'adresse email existe déjà pour un autre utilisateur",
                        user: user
                    } );
                }

                // We create a new owner
                var owner = new Owner({
                    userName: user.username,
                    dvd: []
                });

                // We save the new owner
                owner.save(function (err) {
                    if (err) {
                        console.log("Error during recording Owner");
                    }
                    else {
                        console.log("Owner recorded");
                    }
                });

                // We redirect to the portal view
                req.logIn( user, function( err )
                {
                    if( err )
                    {
                        return next( err );
                    }
                    return res.redirect( '/dvd' );
                } );
            } );
        }

        // Error during the password verification
        else {
            console.log('Password error during the nex user creation')

            res.render( 'sign-up', {
                message: "Le mot de passe ne correspond pas à la confirmation"
            } );
        }

    },

    /**
     * Update the current user.
     * @param req : The request
     * @param res : The response
     */
    updateCurrentUser: function(req, res)
    {
        console.log('Update the current user account')

        if (req.body.username != undefined && req.body.username != "") {
            req.user.username = req.body.username;
        }

        if (req.body.newEmail != undefined && req.body.newEmail != "") {
            req.user.email = req.body.newEmail;
        }

        if (req.body.newPassword != undefined && req.body.newPassword != "") {
            req.user.password = req.body.newPassword;
        }

        req.user.save(function (err) {
            if (err) {
                res.jsonp({"success": false, "status": "Le nom d'utilisateur ou l'adresse email existe déjà pour un autre utilisateur"});
                return handleError(err);
            }

            console.log('Current user updated')
            res.jsonp({"success": true});
        });
    },

    /**
     * Update the user account.
     * @param req : The request
     * @param res : The response
     */
    updateUser: function(req, res)
    {
        console.log('Update a user account')

        User.findOne({ _id: req.body.userID }, function(err, user) {
            if (!user) {
                console.log('User does not exist with this ID')
                res.jsonp({"success": false, "status": 'User does not found'});
            }

            if (req.body.username != undefined && req.body.username != "") {
                user.username = req.body.username;
            }

            if (req.body.newEmail != undefined && req.body.newEmail != "") {
                user.email = req.body.newEmail;
            }

            if (req.body.newPassword != undefined && req.body.newPassword != "") {
                console.log("password not null")
                user.password = req.body.newPassword;
            }

            user.save(function(err) {
                if (err) {
                    console.log("Error during updating the user");
                    res.jsonp({"success": false, "status": "Le nom d'utilisateur ou l'adresse email existe déjà pour un autre utilisateur"});
                }
                else {
                    console.log("User updated");
                    res.jsonp({"success": true});
                }
            });
        });
    },

    /**
     * Delete the given user.
     * @param req : The request
     * @param res : The response
     */
    deleteUser: function( req, res )
    {
        console.log('Delete user in the database')
        var userID = req.body.userID

        // Find the owner to remove
        User.remove({ "_id": userID }, function (err) {
            if (err) {
                res.jsonp({"success": false});
            }

            else {
                console.log('User successfully deleted')
                res.jsonp({"success": true});
            }
        });
    },

    /**
     * Delete the current logged user.
     * @param req : The request
     * @param res : The response
     */
    deleteCurrentUser: function( req, res )
    {
        console.log('Delete current user in the database')

        // Find the owner to remove
        req.user.remove(function (err) {
            if (err) {
                return handleError(err);
            }

            console.log('Current user deleted')
            res.jsonp({"success": true});
        });
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