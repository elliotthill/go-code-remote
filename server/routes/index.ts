var express = require('express');
var router = express.Router();

const {Index} = require('../controllers/index');

/* GET home page. */
router.get('/', Index);

module.exports = router;
