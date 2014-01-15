/**
 * Module dependencies.
 */
var mongoose = require('mongoose');

/**
 * The actor schema needed in the DVD schema.
 */
var actorSchema = mongoose.Schema({
//    firstName: {type: String},
    name: {
        type: String
    }
});

/**
 * The DVD schema.
 */
var dvdSchema = mongoose.Schema({
    title: {
        type: String,
        unique: true
    },
    moviePoster: {
        type: String
    },
    genre: {
        type: String
    },
    releaseDate: {
        type: String
    },
    overview: {
        type: String
    },
    productionCompanies: {
        type: String
    },
    director: {
        type: String
    },
//    actors: {
//        type: String
//    }
    actors: [actorSchema]
});

/**
 * The DVD model which is used to persist DVD in the database.
 */
var Dvd = mongoose.model('Dvd', dvdSchema);
