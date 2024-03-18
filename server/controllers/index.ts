
export function Index (req, res, next) {

    res.render("index", {title: 'GoCodeRemote', version: '0.1.5'}, function(err, list) {

        res.send(list);
    });

}

