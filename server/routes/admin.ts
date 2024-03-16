var express = require('express');
var router = express.Router();

var models = require('../models/index');

/* GET home page. */
router.get('/', function(req, res, next) {

    if (!req.isAuthenticated())
        res.status(500).send("No Access");

    res.render("index", {title: 'Express', version: '1'}, function(err, list) {

        res.send(list);
    });


});

module.exports = router;
