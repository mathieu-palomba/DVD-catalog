/**
* Module dependencies.
*/
var express = require('express');
var mongoose = require('mongoose');
var fs = require( 'fs' );
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
    .use(express.urlencoded())
    .use(express.json());

// Set views path, template engine and default layout
app.set('views', __dirname + '/app/views');
app.set('view engine', 'ejs');

// Routes
require( './config/routes' )( app );

// Server listen the following port
app.listen(3030);

// TODO
// check double entries in the DB (check by name)
// display img in canvas add dvd view
// save img in dvd directory
// get data from internet API
// handle users