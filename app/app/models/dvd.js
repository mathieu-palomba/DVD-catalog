/**
 * Module dependencies.
 */
var mongoose = require('mongoose');

/**
 * The poster schema needed in the Actor and DVD schema.
 */
var posterSchema = mongoose.Schema({
    movieID: {
        type: Number,
        default: 0
    },
    path: {
        type: String,
        default: ''
    },
    width: {
        type: Number,
        default: 0
    },
    height: {
        type: Number,
        default: 0
    },
    aspectRatio: {
        type: Number,
        default: 0
    },
    voteAverage: {
        type: Number,
        default: 0
    },
    voteCount: {
        type: Number,
        default: 0
    }
});


/**
 * The movie credit schema needed in the Filmography schema.
 */
var movieCreditSchema = mongoose.Schema({
    movieID: {
        type: Number,
        default: 0
    },
    title: {
        type: String,
        default: ''
    },
    releaseDate: {
        type: Date
    },
    posterPath: {
        type: String,
        default: ''
    },
    job: {
        type: String,
        default: ''
    },
    department: {
        type: String,
        default: ''
    },
    character: {
        type: String,
        default: ''
    },
    creditID: {
        type: String,
        default: ''
    }
});

/**
 * The TV credit schema needed in the Filmography schema.
 */
var tvCreditSchema = mongoose.Schema({
    tvID: {
        type: Number,
        default: 0
    },
    title: {
        type: String,
        default: ''
    },
    firstAirDate: {
        type: Date
    },
    posterPath: {
        type: String,
        default: ''
    },
    character: {
        type: String,
        default: ''
    },
    creditID: {
        type: String,
        default: ''
    },
    episodeCount: {
        type: Number,
        default: 0
    }
});

/**
 * The actor schema needed in the DVD schema.
 */
var actorSchema = mongoose.Schema({
//    firstName: {type: String},
    actorID: {
        type: Number,
        default: 0
    },
    name: {
        type: String
    },
    character: {
        type: String,
        default: ''
    },
    birthDate: {
        type: Date
    },
    placeOfBirth: {
        type: String,
        default: ''
    },
    deathDate: {
        type: Date
    },
    bibliography : {
        type: String,
        default: ''
    },
    postersPath : [posterSchema],
    movieCredits: [movieCreditSchema],
    tvCredits: [tvCreditSchema]
});

/**
 * The genre schema needed in the DVD schema.
 */
var genreSchema = mongoose.Schema({
    genreID: {
        type: Number,
        default: 0
    },
    name: {
        type: String
    },
    description: {
        type: String,
        default: ''
    }
});

/**
 * The trailer schema needed in the DVD schema.
 */
var trailerSchema = mongoose.Schema({
    trailerID: {
        type: String,
        default: ''
    },
    key: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        default: ''
    },
    language: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: ''
    },
    size: {
        type: Number,
        default: 0
    },
    site: {
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
    },
    phoneNumber: {
        type: Number,
        default: 0000000000
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
    movieID: {
        type: Number,
        default: 0
    },
    moviePoster: {
        type: String
    },
    genres: [genreSchema],
    releaseDate: {
        type: Date
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
    movieFormat: {
        type: String,
        default: ''
    },
    rate: {
        type: Number,
        default: 0
    },
    budget: {
        type: Number,
        default: 0
    },
    popularity: {
        type: Number,
        default: 0
    },
    revenue: {
        type: Number,
        default: 0
    },
    voteAverage: {
        type: Number,
        default: 0
    },
    voteCount: {
        type: Number,
        default: 0
    },
    runtime: {
        type: Number,
        default: 0
    },
    location: {
        type: String,
        default: ''
    },
    trailers: [trailerSchema],
    postersPath: [posterSchema],
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