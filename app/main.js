/**
* Module dependencies.
*/
var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var http = require('http');

/**
* Main application entry file.
* Please note that the order of loading is important.
*/
// Connection to the DB
var db = mongoose.connect('mongodb://localhost/dvd-catalog', function(err) {
    if (err) {
        throw err;
    }
});

// Bootstrap models
var models_path = __dirname + '/app/models';
var walk = function( path )
{
    fs.readdirSync( path ).forEach( function( file )
    {
        var newPath = path + '/' + file;
        var stat = fs.statSync( newPath );
        if( stat.isFile() )
        {
            if( /(.*)\.(js$|coffee$)/.test( file ) )
            {
                require( newPath );
            }
        }
        else if( stat.isDirectory() )
        {
            walk( newPath );
        }
    } );
};
walk( models_path );

// Instantiate express module
var app = express();

// Active logging middleware, notice the /public folder which contain the static files, enable the favicon and allow the body parsing when nodeJS receive a client request (by angularJS for example)
app//.use(express.logger())
    .use(express.static(__dirname + '/public'))
    .use(express.favicon(__dirname + '/public/img/favicon.ico'))
//    .use(express.bodyParser());   // Deprecated, replace by the following two lines
    .use(express.urlencoded())      // Replace bodyParser
    .use(express.json())            // Replace bodyParser
    .use(express.cookieParser())    // CookieParser should be above session
    .use(express.session({
        secret: "mylittlesecret",
        cookie: {maxAge: new Date(Date.now() + 3600000)}, // 1 hour
        maxAge: new Date(Date.now() + 3600000) // 1 hour
    }));

// Set views path, template engine and default layout
app.set('views', __dirname + '/app/views');
app.set('view engine', 'ejs');

// TODO
var passport = require('passport');
var user = require('./app/models/user');

require( './config/passport' )( passport );

// Default session handling. Won't explain it as there are a lot of resources out there
//app.use(express.session({
//    secret: "mylittlesecret",
//    cookie: {maxAge: new Date(Date.now() + 3600000)}, // 1 hour
//    maxAge: new Date(Date.now() + 3600000) // 1 hour
//}));

// The important part. Must go AFTER the express session is initialized
app.use(passport.initialize());
app.use(passport.session());

// Set up your express routes
//var auth = require('./app/controllers/user');
//
//app.post('/auth/login', auth.login);
//app.post('/auth/logout', auth.logout);
//app.get('/auth/login/success', auth.loginSuccess);
//app.get('/auth/login/failure', auth.loginFailure);
//app.post('/auth/register', auth.register);
// END TODO

// Routes
require( './config/routes' )( app );

// Server listen the following port
app.listen(3050);

// TODO
// handle users