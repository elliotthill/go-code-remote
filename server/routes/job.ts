'use strict';

var express = require('express');
var router = express.Router();

//Controllers
const {jobController, jobLocationsController} =  require('../controllers/api/job');

router.get('/jobs', jobController);

router.get('/jobs/locations', jobLocationsController)

module.exports = router;