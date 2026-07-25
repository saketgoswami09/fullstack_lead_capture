'use strict';

const { Router }    = require('express');
const { submitLead }    = require('../controllers/leadController');
const { validateLead }  = require('../middleware/validators');

const router = Router();

// POST /api/leads
router.post('/', validateLead, submitLead);

module.exports = router;
