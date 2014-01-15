/**
* Module dependencies.
*/
var express = require('express');       // Routes module
var mongoose = require('mongoose');     // MongoDB module
var passport = require('passport');     // User sessions module
var fs = require('fs');                 // File System module
var http = require('http');             // HTTP requests module

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

// Passport
require( './config/passport' )( passport );

// Routes
require( './config/routes' )( app );

// Server listen the following port
var port = 3040;
app.listen(port, function() {
    console.log('Server start on port: ' + port);
});