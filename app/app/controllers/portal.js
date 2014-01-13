/*
 * GET home page.
 */
exports.portal = function (req, res) {
    console.log(req.user);
    res.render('portal.ejs', {user: req.user});
};