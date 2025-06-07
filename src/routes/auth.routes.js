const express = require('express');
const authRoutes = express.Router();
const authController = require('../controllers/auth.controller');

authRoutes.post('/signup', authController.signup);
authRoutes.post('/login', authController.login);
authRoutes.post('/forgot-password', authController.forgotPassword);
authRoutes.post('/reset-password', authController.resetPassword);

module.exports = {authRoutes}; 