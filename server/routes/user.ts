'use strict';

import express, {Request, Response, NextFunction} from 'express';
const router = express.Router();
import {User} from '../models/user.js';


router.get('/me', function (req: Request, res: Response) {
    
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