var mongoose = require('mongoose');

/**
 * The actor schema needed in the dvd schema.
 */
var actorSchema = mongoose.Schema({
    name: {type: String},
    firstName: {type: String}
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
    actors: [actorSchema]
});

/**
 * The DVD model which is used to persist DVD in the database.
 */
var Dvd = mongoose.model('Dvd', dvdSchema);
