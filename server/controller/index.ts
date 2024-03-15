var express = require('express');
var router = express.Router();

var models = require('../models/index');

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render("index", {title: 'GoCodeRemote', version: '1'}, function(err, list) {

        res.send(list);
    });


});

module.exports = router;
