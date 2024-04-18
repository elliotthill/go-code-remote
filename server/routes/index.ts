import express from 'express';
const router = express.Router();

import {Index} from '../controllers/index.js';
import {models, sequelize} from '../models/index.js';


/* GET home page. */
router.get('/', Index);

export default router;
