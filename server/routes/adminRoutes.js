'use strict';

const { Router } = require('express');
const { getAllLeads, updateLeadStatus } = require('../controllers/adminController');
const { login, logout, getMe } = require('../controllers/authController');
const adminAuth = require('../middleware/adminAuth');
const { validateStatusUpdate } = require('../middleware/validators');

const router = Router();

// Auth routes (public)
router.post('/login', login);
router.post('/logout', logout);

// All routes below require the admin JWT cookie
router.use(adminAuth);

// GET /api/admin/me                  → get current admin profile
router.get('/me', getMe);

// GET  /api/admin/leads              → list all leads (search + pagination)
router.get('/leads', getAllLeads);

// PATCH /api/admin/leads/:id/status  → update lead status
router.patch('/leads/:id/status', validateStatusUpdate, updateLeadStatus);

module.exports = router;
