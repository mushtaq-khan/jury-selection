const express = require('express');
const caseRoutes = express.Router();
const { createCase, listCases } = require('../controllers/caseController');
const { authenticate } = require('../middleware/auth.middleware'); // Assuming you have auth middleware

caseRoutes.post('/create', authenticate, createCase);
caseRoutes.get('/list', authenticate, listCases);

module.exports = {caseRoutes}; 