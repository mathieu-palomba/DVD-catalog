var passport = require('passport')
    mongoose = require('mongoose'),
    User = mongoose.model('User'); // The model we defined in the previous example

var AuthController = {

    // The sign in view
    signIn: function (req, res) {
        console.log('Sing in');

        res.render('login');
    },

    // Login a user 
    login: passport.authenticate('local', {
        successRedirect: '/user/login/success',
        failureRedirect: '/user/login/failure',
        failureFlash: true                          // You can set you're error message here if you don't want to user the "new LocalStrategy" error message in the return done function
    }),

    // On Login Success callback
    loginSuccess: function(req, res){
        console.log('login success');

        res.json({
            success: true,
            user: req.session.passport.user
        });

        res.redirect( '/dvd' );
    },

    // On Login Failure callback
    loginFailure: function(req, res){
        console.log('login failure');

//        console.log(req.message);

//        User.create({username: 'mathieu', email: 'mathieu@mathieu.fr', password: 'root'}, function(err){
//            if (err) {
//                console.log(err);
//                return;
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

    // Log out a user   
    logout: function(req, res){
        console.log('Logout');

        req.logout();
        res.end();

        res.redirect( '/' );
    },

    // Register a user
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

    // Ensure that user it's authenticated
    ensureAuthenticated: function(req, res, next) {
        console.log('Ensure authenticated');

        if (req.isAuthenticated()) {
            return next();
        }

//        res.redirect( '/' );
        res.render( 'login' );
    }

};

exports = module.exports = AuthController;