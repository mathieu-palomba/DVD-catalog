var mongoose = require('mongoose');

var actorSchema = mongoose.Schema({
    name: {type: String},
    firstName: {type: String}
});

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

var Dvd = mongoose.model('Dvd', dvdSchema);
