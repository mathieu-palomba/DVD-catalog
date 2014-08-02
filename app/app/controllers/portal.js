/*
 * GET home page.
 */
var jsdom = require('jsdom');

exports.portal = function (req, res) {
    console.log('Portal controller');

    res.render('portal', {user: req.user}, function(err, html) {
        var document = jsdom.jsdom('portal');
        var window = jsdom.jsdom().parentWindow;
//        console.log(window.document.body);
        var body = window.document.body;
        body.style.background = 'url(' + req.user.preferences[0].backgroundPath + ') repeat';
//        console.log(html);
        res.send(html);
    });
};