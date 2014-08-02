/**
 * Module dependencies.
 */
var express = require('express'),       // Routes module
    mongoStore = require('connect-mongo')(express),
    flash = require('express-flash'),   // Error message module
    path = require('path');             // To compute directory path

module.exports = function( app, passport, db )
{
    // Set views path, template engine and default layout
    var viewsPath = path.resolve(__dirname, '../app/views');
    app.set('views', viewsPath);
    app.set('view engine', 'ejs');

    // Active logging middleware, notice the /public folder which contain the static files, enable the favicon and allow the body parsing when nodeJS receive a client request (by angularJS for example)
    var publicPath = path.resolve(__dirname, '../public');
    var faviconPath = path.resolve(__dirname, '../public/img/dvd-catalog/favicon.ico');
    app//.use(express.logger())
        .use(express.static(publicPath))
        .use(express.favicon(faviconPath))
//        .use(express.bodyParser());   // Deprecated, replace by the following two lines
        .use(express.urlencoded())      // Replace bodyParser
        .use(express.json())            // Replace bodyParser
        .use(express.cookieParser())    // CookieParser should be above session
//        .use(express.session({          // Default session handling. Won't explain it as there are a lot of resources out there
//            secret: '29ninJaTurtlePoWaaaaaaaaaa31',
//            cookie: {maxAge: new Date(Date.now() + 3600000)},   // 3600000 = 1 hour
//            maxAge: new Date(Date.now() + 3600000)              // 3600000 = 1 hour
//        }))
        .use(express.session({
            secret: '29ninJaTurtlePoWaaaaaaaaaa31',
//            cookie: {maxAge: new Date(Date.now() + 3600000)},   // 3600000 = 1 hour
            cookie: { maxAge: 24* 60 * 60 * 1000 },               // 24 * 60 * 60 * 1000 = 1 day
//            maxAge: new Date(Date.now() + 3600000),             // 3600000 = 1 hour
//            expires: new Date(Date.now() + 36000),
            store: new mongoStore({
                db: db.connection.db,
                clear_interval: 3600, // 3600 seconds
                collection: 'sessions'
            })
        }))
        .use(passport.initialize())     // The important part. Must go AFTER the express session is initialized
        .use(passport.session())        // The important part. Must go AFTER the express session is initialized
        .use(flash())                   // Connect flash for flash messages
        .use(express.errorHandler());

    app.use(app.router);

    // Assume "not found" in the error msgs is a 404. This is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
    app.use(function(err, req, res, next) {
        // Treat as 404
        if (~err.message.indexOf('not found'))
            return next();

        // Log it
        console.error(err.stack);

        // Error page
        res.status(500).render('500', { error: err.stack });
    });

    // Since this is the last non-error-handling middleware used, we assume 404, as nothing else responded.
    app.use(function(req, res, next) {
        res.status(404);

        console.log('404 not found HTML');

        // Respond with html page
        if (req.accepts('html')) {
            res.render('404', { url: req.url });
            return;
        }

        console.log('404 not found JSON');

        // Respond with json
        if (req.accepts('json')) {
            res.send({ error: 'Not found' });
            return;
        }

        console.log('404 not found TEXT');

        // Default to plain-text. send()
        res.type('txt').send('Not found');
    });
};
