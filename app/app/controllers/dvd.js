/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Dvd = mongoose.model('Dvd'),
    Owner = mongoose.model('Owner'),
    fs = require('fs'),             // fs and request is used to download cross domain pictures
    path = require('path'),         // To save files
    http = require('http'),
    request = require('request'),
    multipart = require('multiparty');

/**
 * Get the Owner in relation with the user login.
 * @param req : The request
 * @param res : The response
 */
exports.getCurrentOwner = function(req, res) {
    console.log("Find Owner");

    // Find the current login user
    Owner.findOne({ "userName": req.user.username }, function (err, owner) {
        if (err) {
            return handleError(err);
        }

        else {
            if(owner) {
                console.log('Owner found');
                res.jsonp({"success": true, owner: owner});
            }

            else {
                console.log('Owner not found');
                res.jsonp({"success": false});
            }
        }
    });
};

/**
 * Get the Owner in relation with the user name.
 * @param req : The request
 * @param res : The response
 */
exports.getOwner = function(req, res) {
    console.log("Find Owner with user name");
    var userName = req.params.userName;

    // Find the current login user
    Owner.findOne({ "userName": userName }, function (err, owner) {
        if (err) {
            return handleError(err);
        }

        else {
            if(owner) {
                console.log('Owner found');
                res.jsonp({"success": true, owner: owner});
            }

            else {
                console.log('Owner not found');
                res.jsonp({"success": false});
            }
        }
    });
};

/**
 * Get all of the Owners.
 * @param req : The request
 * @param res : The response
 */
exports.getOwners = function(req, res) {
    console.log("Find owners");

    Owner.find(null, function (err, owners) {
        if (err) {
            return handleError(err);
        }

        else {
            if(owners) {
//                console.log(owners);
//                if(dvd.dvd.length > 0) {
//
//                    // We return OK
                    res.jsonp({"success": true, "owners": owners});
//                }
//                else {
//                    console.log("Error when getting the DVD");
//                    res.jsonp({"success": false});
//                }
            }

            else {
                console.log("Error when getting all of the owners");
                res.jsonp({"success": false});
            }

        }
    });
};

/**
 * Create a new DVD in the database.
 * @param req : The request
 * @param res : The response
 */
exports.create = function (req, res) {
    console.log("Create DVD in nodejs");
    console.log(req.user.username);
//    var owner = req.body.owner.owner;

    // We create the DVD model.
    var newDvd = new Dvd(req.body.dvd);

    // Find the current login user, else we create it
    Owner.findOne({ "userName": req.user.username }, function (err, owner) {
        if (err) {
            return handleError(err);
        }

        else {
            var isError = false;

            // We save a new owner
            if (owner == null) {
                // We create a new owner
                var owner = new Owner({
                    userName: req.user.username,
                    dvd: [newDvd]
                });

                // We save the new owner
                owner.save(function (err) {
                    if (err) {
                        console.log("Error during recording Owner");
                        isError = true;
                    }
                    else {
                        console.log("Owner recorded");
                    }
                });
            }

            // We update the existing owner
            else {
                // We add the new DVD as a sub document
                owner.dvd.unshift(newDvd);

                // We update the owner
                owner.save(function (err) {
                    if (err) {
                        console.log("Error during updating Owner");
                        console.log(err);
                        isError = true;
                    }
                    else {
                        console.log("Owner updated");
                    }
                });
            }

            res.jsonp({"success": !isError});
        }
    });

//    // We save the DVD model in the database.
//    newDvd.save(function (err) {
//        if (err) {
//            console.log("Error during writing DVD");
//            //throw err;
//            isError = true;
//        }
//        else {
//            console.log("DVD recorded");
//        }
//    });

//    res.send();
//    res.jsonp({"success": !isError});
};

/**
 * Delete a DVD in the database.
 * @param req : The request
 * @param res : The response
 */
exports.delete = function (req, res) {
    console.log("Delete DVD in nodejs");
    var dvdToDelete = req.body.dvdID;
    var userName = req.body.userName;

//    owner.dvd.id(dvdToDelete._id).remove();

    // Find the current login user
    Owner.findOne({ "userName": userName }, function (err, owner) {
        if (err) {
            return handleError(err);
        }

        else {
            // We find the DVD to delete
            Owner.findOne({"_id": owner._id, "dvd._id": dvdToDelete}, {"dvd.$": 1}, function (err, dvd) {
                if (err) {
                    return handleError(err);
                }

                else {
                    var isError = false;

                    // If the DVD exist
                    if (dvd) {
                        // We delete the DVD
                        owner.dvd.id(dvd.dvd[0]._id).remove();
//                        owner.dvd.pull(dvd.dvd[0]);

                        // We update the owner
                        owner.save(function (err) {
                            if (err) {
                                console.log("Error during deleting DVD Owner");
                                isError = true;
                            }
                            else {
                                console.log("DVD deleted");
                            }
                        });
                    }

                    // The DVD doesn't exist
                    else {
                        isError = true;
                    }

                    res.jsonp({"success": !isError});
                }
            });
        }
    });

//    // We delete the DVD from the database.
//    Dvd.remove({ title: dvdToDelete }, function (err) {
//        if(err) {
//            console.log("Error when deleting the DVD")
//            res.jsonp({"success": false});
//        }
//
//        else {
//            console.log("DVD successfully deleted")
//            res.jsonp({"success": true});
//        }
//    });
};

/**
 * Edit a DVD in the database.
 * @param req : The request
 * @param res : The response
 */
exports.edit = function (req, res) {
    console.log("Edit DVD in nodejs");
    var dvdToEdit = req.body.dvd;
    var owner = req.body.owner;
    console.log(owner._id);
    console.log(dvdToEdit._id);

    Owner.update({"_id": owner._id, "dvd._id": dvdToEdit._id},
        {$set: {"dvd.$.title": dvdToEdit.title, "dvd.$.moviePoster": dvdToEdit.moviePoster,
            "dvd.$.genres": dvdToEdit.genres, "dvd.$.releaseDate": dvdToEdit.releaseDate,
            "dvd.$.overview": dvdToEdit.overview, "dvd.$.productionCompanies": dvdToEdit.productionCompanies,
            "dvd.$.director": dvdToEdit.director, "dvd.$.actors": dvdToEdit.actors,
            "dvd.$.rate": dvdToEdit.rate, "dvd.$.comments": dvdToEdit.comments,
            "dvd.$.movieFormat": dvdToEdit.movieFormat, "dvd.$.location": dvdToEdit.location} },
        function (err, numberAffected) {
            if (err) {
                console.log("Error during updating the DVD");
                res.jsonp({"success": false});
                console.log(err);
            }
            else {
                console.log("DVD updated " + numberAffected);
                res.jsonp({"success": true});
            }
        });

//    // We update the DVD from the database.
//    Dvd.update({ title: dvdToEdit.oldTitle }, { $set: { title: dvdToEdit.title, moviePoster: dvdToEdit.moviePoster,
//         genre: dvdToEdit.genre, releaseDate: dvdToEdit.releaseDate,
//         overview: dvdToEdit.overview, productionCompanies: dvdToEdit.productionCompanies,
//         director: dvdToEdit.director, actors: dvdToEdit.actors } },
//        function (err, numberAffected) {
//        if (err) {
//            console.log("Error during updating the DVD");
//            res.jsonp({"success": false});
//        }
//        else {
//            console.log("DVD updated " + numberAffected);
//            res.jsonp({"success": true});
//        }
//    });
}

/**
 * Get all DVD in the database.
 * @param req : The request
 * @param res : The response
 */
exports.getAllDvd = function (req, res) {
    console.log('Get all DVD');
//    var owner = req.params.owner.owner;

    Owner.find({"userName": req.user.username})
        .exec(function (err, dvd) {
            if (err == true) {
                console.log("Error during reading the DVD list");

                // We return KO
//                res.send('err');
                res.jsonp({"success": false});
            }
            else {
                if(dvd.length > 0) {
                    console.log("DVD list got");
//                    console.log(dvd);

                    // We return OK
                    res.jsonp({"success": true, "dvdList": dvd});
                }
                else {
                    console.log("Error when getting the DVD list");

                    res.jsonp({"success": false});
                }
            }
        });

//    Dvd.find(null)
//        .exec(function (err, data) {
//            if (err == true) {
//                console.log("Error during reading the DVD list");
//
//                // We return KO
////                res.send('err');
//                res.jsonp({"success": false});
//            }
//            else {
//                console.log("DVD list got");
//
//                if(data.length > 0) {
//                    // We return OK
//                    res.jsonp({"success": true, "dvdList": data});
//                }
//                else {
//                    res.jsonp({"success": false});
//                }
//            }
//        })
};

/**
 * Get the DVD requested by the user in the database.
 * @param req : The request
 * @param res : The response
 */
exports.getDvd = function (req, res) {
    console.log('Get DVD');
    var dvdRequested = req.params.dvdID;
    var userName = req.params.userName;
    console.log(dvdRequested);
    console.log(userName);

    Owner.findOne({"userName": userName, "dvd._id": dvdRequested}, {"dvd.$": 1}, function (err, dvd) {
        if (err) {
            return handleError(err);
        }

        else {
            if(dvd) {
                if(dvd.dvd.length > 0) {
                    console.log("DVD got");

                    // We return OK
                    res.jsonp({"success": true, "dvd": dvd});
                }
                else {
                    console.log("Error when getting the DVD");
                    res.jsonp({"success": false});
                }
            }

            else {
                console.log("Error when getting the DVD");
                res.jsonp({"success": false});
            }

        }
    });

//    Dvd.find({title: dvdRequested})
//        .exec(function (err, data) {
//            if (err == true) {
//                console.log("Error during reading the DVD");
//
//                // We return KO
//                res.jsonp({"success": false});
//            }
//            else {
//                console.log("DVD got");
//
//                if(data.length > 0) {
//                    // We return OK
//                    res.jsonp({"success": true, "dvd": data});
//                }
//                else {
//                    res.jsonp({"success": false});
//                }
//            }
//        })
};


/**
 * Check if the DVD requested by the user is in the database.
 * @param req : The request
 * @param res : The response
 */
exports.isDvdExist = function (req, res) {
    // Title and release date it's used to avoid problem if the title isn't unique
    var dvdRequested = req.params.dvdTitle;
    var releaseDate = req.params.releaseDate;
//    var owner = req.params.owner.owner;
    var isExist = false;
    console.log('Is DVD exist');
    console.log(dvdRequested);
    console.log(req.user.username);

    Owner.findOne({"userName": req.user.username, "dvd.title": dvdRequested, "dvd.releaseDate": releaseDate}, {"dvd.$": 1}, function (err, dvd) {
        if (err) {
            return handleError(err);
        }

        else {
            console.log("DVD got");
            console.log(dvd);
            if(dvd != undefined) {
                console.log("DVD exist");
                isExist = true;
            }

            // We return OK or KO
            res.jsonp({"success": isExist});
        }
    });

//    Dvd.find({title: dvdRequested})
//        .exec(function (err, data) {
//            if (err == true) {
//                console.log("Error during checking the DVD");
//
//                // We return KO
//                res.jsonp({"success": false});
//            }
//            else {
//                console.log(data);
//                if(data[0] != undefined) {
//                    console.log("DVD exist");
//                    isExist = true;
//                }
//
//                // We return OK or KO
//                res.jsonp({"success": isExist});
//            }
//        })
};

/**
 * Update the current owner in the database.
 * @param req : The request
 * @param res : The response
 */
exports.updateCurrentOwner = function (req, res) {
    console.log("Update the current owner in database");

    Owner.findOne({ "userName": req.user.username }, function(err, owner) {
        if (!owner) {
            console.log('Owner does not exist with this user name')
            res.jsonp({"success": false, "status": 'User does not found'});
        }

        if (req.body.userName != undefined && req.body.userName != "") {
            owner.userName = req.body.userName;
        }

        owner.save(function(err) {
            if (err) {
                console.log("Error during updating the owner");
                res.jsonp({"success": false, "status": "Le nom d'utilisateur existe déjà pour un autre utilisateur"});
            }
            else {
                console.log("Current owner updated");
                res.jsonp({"success": true});
            }
        });
    });
};

/**
 * Delete an owner in the database.
 * @param req : The request
 * @param res : The response
 */
exports.deleteOwner = function (req, res) {
    console.log("Delete owner in database");
    var ownerID = req.body.ownerID;

    // Find the owner to remove
    Owner.remove({ "_id": ownerID }, function (err) {
        if (err) {
            res.jsonp({"success": false});
        }

        else {
            console.log('Owner successfully deleted')
            res.jsonp({"success": true});
        }
    });
};

/**
 * Delete the current logged owner in the database.
 * @param req : The request
 * @param res : The response
 */
exports.deleteCurrentOwner = function (req, res) {
    console.log("Delete current owner in database");

    // Find the owner to remove
    Owner.findOne({ "userName": req.user.username }, function (err, owner) {
        if (err) {
            return handleError(err);
        }

        else {
            if(owner) {
                console.log('Owner found');

                owner.remove(function (err) {
                    if (err) {
                        return handleError(err);
                    }

                    console.log('Current owner deleted')
                    res.jsonp({"success": true});
                });
            }

            else {
                console.log('Owner not found');
                res.jsonp({"success": false});
            }
        }
    });
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
    var imagePath = path.resolve(__dirname, '../../public/img/users/movie-posters/', filename);

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
    var temporaryImagePath = path.resolve(__dirname, '../../public/img/users/movie-posters/', temporaryFilename)
    var imagePath = path.resolve(__dirname, '../../public/img/users/movie-posters/', filename);

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
            res.jsonp({"success": true, "newImagePath": imagePath});
        }
    })
};

exports.uploadImage = function(req, res){
    console.log('Upload image');

    // We compute the good path
    var temporaryImagePath = path.resolve(__dirname, '../../public/img/users/movie-posters/')

    // We create the form which permit to get the uploaded image
    var form = new multipart.Form({autoFiles: true, uploadDir: temporaryImagePath});

    // We parse the request to find the uploaded image (parse an incoming multipart/form-data request)
    form.parse(req, function(err, fields, files) {
        if(err) throw err;

        console.log("Upload completed!");

        // We get the image names
        var uploadedImageName = path.basename(files.file[0].path);
        var newImageName = files.file[0].originalFilename;

        // We return OK
        res.jsonp({"success": true, "uploadedImageName": uploadedImageName, "newImageName": newImageName});
    });
};

exports.uploadBackupFile = function(req, res){
    console.log('Upload backup file');

    // Parse a file uploaded
    var form = new multipart.Form();

    form.parse(req, function(err, fields, files) {
        console.log(files)
//        console.log(files.backupFile)
//        console.log(files.backupFile[0].path)
//        console.log(files.file[0].path)

        fs.readFile(files.file[0].path, 'utf8', function (err, data) {
        console.log(data)

        // We return OK
        res.jsonp({"success": true});
        });
    });

};

exports.updateImgSrcPath = function(req, res) {
    console.log('Update img src path');

//    if (typeof model[property] == 'function')
    Owner.find(null, function (err, owners) {
        if (err) {
            return handleError(err);
        }

        else {
            if(owners) {
                owners.forEach(function(owner){

                    owner.dvd.forEach(function(dvd){
                        console.log('For each DVD');
                        console.log(dvd);

                        dvd.moviePoster = dvd.moviePoster.replace("img/", "img/users/movie-posters/");
                        console.log('DVD updated');
                        console.log(dvd);

                        // We update the dvd list
//                        dvd.save(function(err) {
//                            if (err) {
//                                console.log("Error during updating the dvd: " + dvd.title);
//                            }
//                            else {
//                                console.log("Dvd updated: " + dvd.title);
//                                console.log(dvd.moviePoster);
//                            }
//                        });
                    });

                    // We update the owner
                    owner.save(function(err) {
                        if (err) {
                            console.log("Error during updating the Owner: " + owner.userName);
                        }
                        else {
                            console.log("Owner updated: " + owner.userName);
                        }
                    });
                });


                // We return OK
                res.jsonp({"success": true});
            }

            else {
                console.log("Error when getting all of the owners");
                res.jsonp({"success": false});
            }
        }
    });
};