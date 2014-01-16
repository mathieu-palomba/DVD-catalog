/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Dvd = mongoose.model('Dvd'),
    fs = require('fs'),             // fs and request is used to download cross domain pictures
    path = require('path'),         // To save files
    http = require('http'),
    request = require('request');

/**
 * Create a new DVD in the database.
 * @param req : The request
 * @param res : The response
 */
exports.create = function (req, res) {
    console.log("Create DVD in nodejs");
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
 * Delete a DVD in the database.
 * @param req : The request
 * @param res : The response
 */
exports.delete = function (req, res) {
    console.log("Delete DVD in nodejs");
    var dvdToDelete = req.body.dvd;

    // We delete the DVD from the database.
    Dvd.remove({ title: dvdToDelete }, function (err) {
        if(err) {
            console.log("Error when deleting the DVD")
            res.jsonp({"success": false});
        }

        else {
            console.log("DVD successfully deleted")
            res.jsonp({"success": true});
        }
    });
};

/**
 * Edit a DVD in the database.
 * @param req : The request
 * @param res : The response
 */
exports.edit = function (req, res) {
    console.log("Edit DVD in nodejs");
    var dvdToEdit = req.body.dvd;

    // We update the DVD from the database.
    Dvd.update({ title: dvdToEdit.oldTitle }, { $set: { title: dvdToEdit.title, moviePoster: dvdToEdit.moviePoster,
         genre: dvdToEdit.genre, releaseDate: dvdToEdit.releaseDate,
         overview: dvdToEdit.overview, productionCompanies: dvdToEdit.productionCompanies,
         director: dvdToEdit.director, actors: dvdToEdit.actors } },
        function (err, numberAffected) {
        if (err) {
            console.log("Error during updating the DVD");
            res.jsonp({"success": false});
        }
        else {
            console.log("DVD updated " + numberAffected);
            res.jsonp({"success": true});
        }
    });
}

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
                res.jsonp({"success": false});
            }
            else {
                console.log("DVD list got");

                if(data.length > 0) {
                    // We return OK
                    res.jsonp({"success": true, "dvdList": data});
                }
                else {
                    res.jsonp({"success": false});
                }
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
                res.jsonp({"success": false});
            }
            else {
                console.log("DVD got");

                if(data.length > 0) {
                    // We return OK
                    res.jsonp({"success": true, "dvd": data});
                }
                else {
                    res.jsonp({"success": false});
                }
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
                res.jsonp({"success": false});
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
    var imagePath = path.resolve(__dirname, '../../public/img/', filename);

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

/**
 * Rename the "temporaryFilename" pictures at the "filename" path.
 * @param req : The request
 * @param res : The response
 */
exports.renameImage = function(req, res){
    console.log('Rename image');

    // We get the temporary filename and the filename
    var temporaryFilename = req.body.temporaryFilename;
    var filename = req.body.filename;

    // We compute the good paths
    var temporaryImagePath = path.resolve(__dirname, '../../public/img/', temporaryFilename)
    var imagePath = path.resolve(__dirname, '../../public/img/', filename);

    console.log(temporaryImagePath);
    console.log(imagePath);

    // We rename the temporary image with the "temporary filename" in the "filename" image
    fs.rename(temporaryImagePath, imagePath, function(err) {
        if (err) {
            console.log(err)

            // We return KO
            res.jsonp({"success": false});
        }

        else {
            console.log("Rename");

            // We return OK
            res.jsonp({"success": true});
        }
    })
};