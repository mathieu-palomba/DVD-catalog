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
    },
    character: {
        type: String,
        default: ''
    },
    birthDate: {
        type: String,
        default: ''
    },
    bibliography : {
        type: String,
        default: ''
    },
    posterPath : {
        type: String,
        default: ''
    }
});

/**
 * The genre schema needed in the DVD schema.
 */
var genreSchema = mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String,
        default: ''
    }
});

/**
 * The borrower schema needed in the DVD schema.
 */
var borrowerSchema = mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    address: {
        type: String,
        default: ''
    }
});

/**
 * The DVD schema.
 */
var dvdSchema = mongoose.Schema({
    title: {
        type: String
//        unique: true
    },
    moviePoster: {
        type: String
    },
    genres: [genreSchema],
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
    actors: [actorSchema],
    comments: {
        type: String,
        default: ''
    },
    isBlueray: {
        type: Boolean,
        default: false
    },
    rate: {
        type: Number,
        default: 0
    },
    location: {
        type: String,
        default: ''
    },
    borrower: [borrowerSchema]
});

/**
 * The Owner schema.
 */
var ownerSchema = mongoose.Schema({
    userName: {
        type: String,
        unique: true
    },
    dvd: [dvdSchema]
});

/**
 * The DVD model which is used to persist DVD in the database.
 */

var Owner = mongoose.model('Owner', ownerSchema);
var Dvd = mongoose.model('Dvd', dvdSchema);