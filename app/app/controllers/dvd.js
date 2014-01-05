/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Dvd = mongoose.model('Dvd'),
    fs = require('fs'),             // fs and request is used to download cross domain pictures
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
    var newDvd = new Dvd({
        name: req.body.dvd.name,
        genre: req.body.dvd.genre,
        release_date: req.body.dvd.releaseDate,
        overview: req.body.dvd.overview,
        productionCompanies: req.body.dvd.productionCompanies,
        director: req.body.dvd.director,
        actors: req.body.dvd.actors
    });

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
                res.send('err');
            }
            else {
                console.log("DVD list got");
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

    Dvd.find({name: dvdRequested})
        .exec(function (err, data) {
            if (err == true) {
                console.log("Error during reading the DVD");
                res.send('err');
            }
            else {
                console.log("DVD got");
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
    console.log(dvdRequested);

    Dvd.find({name: dvdRequested})
        .exec(function (err, data) {
            if (err == true) {
                console.log("Error during checking the DVD");
                res.send('err');
            }
            else {
                if(data[0] != undefined) {
                    console.log("DVD exist");
                    isExist = true;
                }

                res.jsonp({"success": isExist});
            }
        })
};

/**
 * Download the "uri" pictures at the "filename" path.
 * @param uri : The source of the picture to download
 * @param filename : The name of the picture downloaded.
 * download('https://www.google.com/images/srpr/logo3w.png', 'google.png');
 */
exports.download = function(uri, filename){
    request.head(uri, function(err, res, body){
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename));
    });
};