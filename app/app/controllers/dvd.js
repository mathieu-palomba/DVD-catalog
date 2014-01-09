/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Dvd = mongoose.model('Dvd'),
    fs = require('fs'),             // fs and request is used to download cross domain pictures
    path = require('path'),         // to save files
    request = require('request');

/**
 * Create a new DVD in the database.
 * @param req : The request
 * @param res : The response
 */
exports.create = function (req, res) {
    console.log("create DVD in nodejs");
    console.log(req.body.dvd);
    var isError = false;

    // We create the DVD model.
    var newDvd = new Dvd({
        title: req.body.dvd.title,
        moviePoster: req.body.dvd.moviePoster,
        genre: req.body.dvd.genre,
        releaseDate: req.body.dvd.releaseDate,
        overview: req.body.dvd.overview,
        productionCompanies: req.body.dvd.productionCompanies,
        director: req.body.dvd.director,
        actors: req.body.dvd.actors//actorsArray
    });

    // We save the DVD model in the database.
    newDvd.save(function (err) {
        if (err) {
            console.log("Error during writing DVD");
            //throw err;
            isError = true;
        }
        else {
            console.log("DVD recorded");
        }
    });

//    res.send();

    // We return OK or KO
    res.jsonp({"success": !isError});
};

/**
 * Get all DVD in the database.
 * @param req : The request
 * @param res : The response
 */
exports.getAllDvd = function (req, res) {
    Dvd.find(null)
        .exec(function (err, data) {
            if (err == true) {
                console.log("Error during reading the DVD list");

                // We return KO
//                res.send('err');
                result.jsonp({"success": false});
            }
            else {
                console.log("DVD list got");

                // We return OK
                res.jsonp({"success": true, "dvdList": data});
            }
        })
};

/**
 * Get the DVD requested by the user in the database.
 * @param req : The request
 * @param res : The response
 */
exports.getDvd = function (req, res) {
    var dvdRequested = req.params.dvd;
    console.log(dvdRequested);

    Dvd.find({title: dvdRequested})
        .exec(function (err, data) {
            if (err == true) {
                console.log("Error during reading the DVD");

                // We return KO
                result.jsonp({"success": false});
            }
            else {
                console.log("DVD got");

                // We return OK
                res.jsonp({"success": true, "dvd": data});
            }
        })
};


/**
 * Check if the DVD requested by the user is in the database.
 * @param req : The request
 * @param res : The response
 */
exports.isDvdExist = function (req, res) {
    var dvdRequested = req.params.dvd;
    var isExist = false;
    console.log('Is DVD exist');
    console.log(dvdRequested);

    Dvd.find({title: dvdRequested})
        .exec(function (err, data) {
            if (err == true) {
                console.log("Error during checking the DVD");

                // We return KO
                result.jsonp({"success": false});
            }
            else {
                console.log(data);
                if(data[0] != undefined) {
                    console.log("DVD exist");
                    isExist = true;
                }

                // We return OK or KO
                res.jsonp({"success": isExist});
            }
        })
};

/**
 * Download the "uri" pictures at the "filename" path.
 * @param req : The request
 * @param res : The response
 * saveImage('https://www.google.com/images/srpr/logo3w.png', 'google.png');
 */
exports.saveImage = function(req, res){
    // We get the uri to download the file and the filename
    var uri = req.body.uri;
    var filename = req.body.filename;
    var result = res;

    // We compute the good path
    var imagePath = path.resolve(__dirname, '../../public/img/', filename)

    // We get the image with the uri
    request.head(uri, function(err, res, body){
        if (err == true) {
            console.log("Error during getting the poster image");

            // We return KO
            result.jsonp({"success": false});
        }

        else {
            console.log('content-type:', res.headers['content-type']);
            console.log('content-length:', res.headers['content-length']);

            // We create the image file
            request(uri).pipe(fs.createWriteStream(imagePath));

            // We return OK
            result.jsonp({"success": true});
        }
    });
};