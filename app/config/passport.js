var mongoose = require( 'mongoose' ),
    LocalStrategy = require( 'passport-local' ).Strategy,
    User = mongoose.model( 'User' );


module.exports = function( passport )
{
    //Serialize sessions
    passport.serializeUser( function( user, done )
    {
        done( null, user.id );
    } );

    passport.deserializeUser( function( id, done )
    {
        User.findOne( {
            _id: id
        }, function( err, user )
        {
            done( err, user );
        } );
    } );

    passport.validPassword = function(password){
        if (this.password == password){
            return true;
        }

        return false;
    }

    //Use local strategy
    passport.use( new LocalStrategy( {
            usernameField: 'username',
            passwordField: 'password'
        },
        function( username, password, done )
        {
            console.log('Local srategy ' + username + ' ' + password);

            User.findOne( {username: username}, function( err, user )
            {
                if( err )
                {
                    console.log("Error");
                    return done( err );
                }
                if( !user )
                {
                    console.log("User not found");
                    return done( null, false, {
                        message: 'Unknown user'
                    } );
                }
                if( password != user.password )
                {
                    console.log("Invalid password");
                    return done( null, false, {
                        message: 'Invalid password'
                    } );
                }
                return done( null, user );
            } );
        }
    ) );
};