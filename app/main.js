/**
* Module dependencies.
*/
var express = require('express');       // Routes module
var mongoose = require('mongoose');     // MongoDB module
var passport = require('passport');     // User sessions module
var fs = require('fs');                 // File System module
var http = require('http');             // HTTP requests module


// Server configuration
var config = require( './config/env/config' );

/**
* Main application entry file.
* Please note that the order of loading is important.
*/
// Connection to the DB
var db = mongoose.connect(config.dbPath, function(err) {
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
require( './config/express' )( app, passport, db );

// Passport
require( './config/passport' )( passport );

// Routes
require( './config/routes' )( app );

// Server listen the following port
app.listen(config.port, function() {
    console.log('Server start on port: ' + config.port);
});

//**** TODO ****//
// Supprimer l'image du moviePoster lors de la supprésion d'un film ???
// Rajouter _ devant le nom du fichier temporaire de moviePoster ???

// Vérifier si le titre du film existe avant de l'enregister dans la vue edit-dvd
// Faire fichies de conf pour la langue et les constantes
// Gestion collection de DVD (combien par categories...)
// Faire zone register
// Rajouter option choix couleur de body dans la section compte
// Pour utiliser le champ rechercher uniquement sur des acteurs, titre ou producteurs
// Rajouter option 'Dvd preter'
// Rajouter image acteurs
// Avoir une couleur différente pour les combobox de filtrage lorsqu'un filtre est activé
// Pouvoir modifier compte d'un utilisateur depuis la zone administrateur
// Mettre un compteur de mots de passe érronés
// Avoir possibilité d'activer/désactiver l'enregistrement des utilisateurs



//**** OK ****//
// Rajouter message d'érreurs lors de la connection sur signin
// Rajouter une case commentaire lors de l'ajout d'un film dans la vue add-dvd
// Gestion mot de passe avec bcrypt
// Gérer zone adminisatrateur
// Traduire message de suppression en français
// Ne pas rendre required la société de production
// Regarder problème session qui expire et bugs
// Ajouter plusieurs genres
// Rajouter les choix multiple lors de l'appuie sur rechercher dans la vue add-dvd
// Rajouter date de sortie du film à coté du nom du film dans les autres choix de recherche de la vue 'add-dvd'
// Séparer role de l'acteur de son nom (pour faire recherche google)
// Corriger bug plusieurs films avec le même nom dans la vue 'add-dvd', rechercher par ID et pas par nom
// Change date String en date pour le model de DVD
// Rajouter ranking dans la vue 'add-dvd'
// Rajouter option 'emplacement Dvd'
// Vérifier enregistrement DVD manuelement (pour le movie poster)
// Rajouter fonction collapse pour éviter de tout afficher dans la vue 'dvd-list'
// Pouvoir éditer un utilisateur (mail, username, password...)
// Refactoring date filter dans userAccount
// Mettre à jour utilisateur grâce à son ID et pas son email
// Rajouter option pour supprimer compte depuis la vue administrateur/ et depuis le compte utilisateur
// Corriger bug accès à tous les utilisateur depuis une vue non administrateur