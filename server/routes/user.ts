'use strict';

import express from 'express';
const router = express.Router();



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



export default router;