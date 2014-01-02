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
    console.log("create DVD in ndejs");
    console.log(req.body);
    var isError = false;

    var newDvd = new Dvd({
        name: req.body.name,
        genre: req.body.genre,
        release_date: req.body.releaseDate,
        overview: req.body.overview,
        actors: [req.body.actors]
    });

    newDvd.save(function (err) {
        if (err) {
            console.log("erreur d'écriture")
            throw err;
            isError = true;
        }
        else {
            console.log("enregistrement effectué");
        }
    });

//    res.send();
    res.jsonp( {"success": !isError} );
};