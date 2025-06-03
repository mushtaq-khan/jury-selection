const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
// const authMiddleware = require('../middleware/auth.middleware');

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router; 