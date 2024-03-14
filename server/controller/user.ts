'use strict';

const express = require('express');
const router = express.Router();

const passport = require('passport');
const models = require('../models/index');

router.get('/me', function (req, res) {

    let api_response = {};
    if (req.isAuthenticated()) {

        /*
         * Just throw out the id, email here
         * I watched a tutorial on object destructuring so I have to use it somewhere
         */
        (({id, email}) => {

            res.json({
                'id':id,
                'email': email
            })
        }
        )(req.user);



    } else {
        res.status(500).json({});
    }

});




module.exports = router;