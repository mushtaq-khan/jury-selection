const express = require('express');
const router = express.Router();
const {authRoutes} = require('./auth.routes');
const {caseRoutes} = require('./caseRoutes');
const {jurorRoutes} = require('./jurorRoutes');

router.use('/auth', authRoutes);
router.use('/cases', caseRoutes);
router.use('/jurors', jurorRoutes);

module.exports = router;