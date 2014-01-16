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

// TODO
// Gérer les utilisateurs
// Rajouter trié par rank (avec les petites étoiles)
// Rajouter les choix multiple lors de l'appuie sur rechercher dans la vue add-dvd
// Rajouter message d'érreurs lors de la connection sur signin
// Rajouter images erreur page 404
// Rajouter une case commentaire lors de l'ajout d'un film dans la vue add-dvd
// Gérer zone adminisatrateur
// Ajouter plusieurs genres
// Faire fichies de conf pour la langue et les constantes
// Vérifier enregistrement DVD manuelement (pour le movie poster)
// Pouvoir éditer un utilisateur (mail, username, password...)