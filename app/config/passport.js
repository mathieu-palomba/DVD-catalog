/**
 * Module dependencies.
 */
var mongoose = require( 'mongoose' ),
    LocalStrategy = require( 'passport-local' ).Strategy,
    User = mongoose.model( 'User' );


module.exports = function( passport )
{
    // Serialize sessions
    passport.serializeUser( function( user, done )
    {
        done( null, user.id );
    } );

    // Deserialize sessions
    passport.deserializeUser( function( id, done )
    {
        User.findOne( {
            _id: id
        }, function( err, user )
        {
            done( err, user );
        } );
    } );

    // Use local strategy
    passport.use( new LocalStrategy( {
            usernameField: 'username',
            passwordField: 'password'
        },
        function( username, password, done )
        {
            console.log('Local strategy ' + username + ' ' + password);

            User.findOne( {username: username}, function( err, user )
            {
                if( err )
                {
                    console.log("Error");

                    return done( err );
                }
                if( !user )
                {
                    console.log("Utilisateur inconnu");

                    return done( null, false, {
                        message: 'Unknown user'
                    } );
                }

                // bcrypt usage
                user.comparePassword(password, function (err, isMatch) {
                    if (err) {
                        return done(err);
                    }

                    if (isMatch) {
                        // I'm specifying the fields that I want to save into the user's session. I don't want to save the password in the session
                        return done(null, {
                            id: user._id,
                            username: user.username,
                            email: user.email
                        });
                    }

                    else {
                        return done(null, false, { message: 'Mot de passe incorrect' });
                    }
                });
            } );
        }
    ) );
};