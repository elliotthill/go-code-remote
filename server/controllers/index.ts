
function Index (req, res, next) {

    res.render("index", {title: 'GoCodeRemote', version: '0.1.2'}, function(err, list) {

        res.send(list);
    });

}

module.exports = {Index}