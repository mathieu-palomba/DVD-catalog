/**
* Module dependencies.
*/
var express = require('express');       // Routes module
var mongoose = require('mongoose');     // MongoDB module
var passport = require('passport');     // User sessions module
var fs = require('fs');                 // File System module
var http = require('http');             // HTTP requests module
//var flash = require('connect-flash');   // Error message module

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

// Express
require( './config/express' )( app, passport );

//// Set views path, template engine and default layout
//app.set('views', __dirname + '/app/views');
//app.set('view engine', 'ejs');
//
//// Active logging middleware, notice the /public folder which contain the static files, enable the favicon and allow the body parsing when nodeJS receive a client request (by angularJS for example)
//app//.use(express.logger())
//    .use(express.static(__dirname + '/public'))
//    .use(express.favicon(__dirname + '/public/img/dvd-catalog/favicon.ico'))
////    .use(express.bodyParser());   // Deprecated, replace by the following two lines
//    .use(express.urlencoded())      // Replace bodyParser
//    .use(express.json())            // Replace bodyParser
//    .use(express.cookieParser())    // CookieParser should be above session
//    .use(express.session({          // Default session handling. Won't explain it as there are a lot of resources out there
//        secret: "mylittlesecret",
//        cookie: {maxAge: new Date(Date.now() + 3600000)},   // 3600000 = 1 hour
//        maxAge: new Date(Date.now() + 3600000)              // 3600000 = 1 hour
//    }))
//    .use(flash())                   // Connect flash for flash messages
//    .use(passport.initialize())     // The important part. Must go AFTER the express session is initialized
//    .use(passport.session());       // The important part. Must go AFTER the express session is initialized

// Passport
require( './config/passport' )( passport );

// Routes
require( './config/routes' )( app );

// Server listen the following port
var port = 3040;
app.listen(port, function() {
    console.log('Server start on port: ' + port);
});

// TODO
// handle users