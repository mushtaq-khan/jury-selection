const express = require('express');
const jurorRoutes = express.Router();
const { createJuror, listJurors, deleteJuror } = require('../controllers/jurorController');
const { authenticate } = require('../middleware/auth.middleware');

jurorRoutes.post('/create', authenticate, createJuror);
jurorRoutes.get('/list', authenticate, listJurors);
jurorRoutes.delete('/delete/:id', authenticate, deleteJuror);

module.exports = {jurorRoutes};