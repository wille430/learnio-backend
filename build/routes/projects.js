const express = require('express');
const { default: Project } = require('../controllers/Project');
const authenticateJWT = require('../services/authenticateJWT');
const router = express.Router();
router.get('/', authenticateJWT, Project.getAll);
module.exports = router;
