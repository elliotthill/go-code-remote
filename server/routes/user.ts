'use strict';

const express = require('express');
const router = express.Router();

const passport = require('passport');
const models = require('../models/index');

router.get('/me', function (req, res) {
    
    if (req.isAuthenticated()) {

        /*
         * Return the logged in users info
         */
        const {id, email} = req.user;

        res.json({
            id,
            email
        })


    } else {
        res.status(500).json({});
    }

});




module.exports = router;