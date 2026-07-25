'use strict';

const { Router } = require('express');
const { getAllLeads, updateLeadStatus } = require('../controllers/adminController');
const adminAuth                         = require('../middleware/adminAuth');
const { validateStatusUpdate }          = require('../middleware/validators');

const router = Router();

// All routes below require the admin secret header
router.use(adminAuth);

// GET  /api/admin/leads              → list all leads (search + pagination)
router.get('/leads', getAllLeads);

// PATCH /api/admin/leads/:id/status  → update lead status
router.patch('/leads/:id/status', validateStatusUpdate, updateLeadStatus);

module.exports = router;
