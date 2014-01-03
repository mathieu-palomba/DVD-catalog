var mongoose = require('mongoose');

/**
 * The actor schema needed in the DVD schema.
 */
var actorSchema = mongoose.Schema({
    firstName: {type: String},
    lastName: {type: String}
});

/**
 * The DVD schema.
 */
var dvdSchema = mongoose.Schema({
    name: {
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
    actors: [actorSchema]
});

/**
 * The DVD model which is used to persist DVD in the database.
 */
var Dvd = mongoose.model('Dvd', dvdSchema);
