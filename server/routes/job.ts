'use strict';

var express = require('express');
var router = express.Router();

//Controllers
const {jobController} =  require('../controllers/api/job');

router.get('/jobs', jobController);

module.exports = router;