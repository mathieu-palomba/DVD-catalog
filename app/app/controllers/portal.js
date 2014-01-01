/*
 * GET home page.
 */
exports.portal = function (req, res) {
    res.render('portal.ejs', {portal: req.params.num});
};