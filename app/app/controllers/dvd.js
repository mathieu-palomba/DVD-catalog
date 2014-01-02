/**
* Module dependencies.
*/
var mongoose = require( 'mongoose' ),
    Dvd = mongoose.model( 'Dvd' );

/**
* Create a dvd
*/
exports.create = function( req, res )
{
    var newDvd = new Dvd({
        name: 'Avatar',
        genre: 'Science fiction',
        release_date: '26 juin 1990',
        overview: 'It is me',
        actors: [{name:'moi', firstName:'toi'}]
    });

    newDvd.save(function (err) {
        if (err) {
            console.log("erreur d'écriture")
            throw err;
        }
        else {
            console.log("enregistrement effectué");
        }
    });
};
