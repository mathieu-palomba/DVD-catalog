/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Dvd = mongoose.model('Dvd');

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
        actors: [req.body.dvd.actors]
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
                res.jsonp({"success": true, "dvd": data});
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