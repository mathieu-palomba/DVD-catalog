/*
 * GET home page.
 */
exports.portal = function (req, res) {
    console.log('Portal controller');
    console.log(req.user);
    res.render('portal', {user: req.user});
};