'use strict';

import express from 'express';
const router = express.Router();

//Controllers
import {jobController, jobLocationsController} from '../controllers/api/job.js';

router.get('/jobs', jobController);

router.get('/jobs/locations', jobLocationsController)

export default router;