/*
 * GET home page.
 */
exports.portal = function (req, res) {
    console.log(req);
    res.render('portal.ejs');
};