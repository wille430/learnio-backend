const express = require('express');
const router = express.Router();
const authenticateJWT = require('../services/authenticateJWT');
const { check } = require('express-validator');
const { default: User } = require('../controllers/User');
const { default: Project } = require('../controllers/Project');
const { default: Technique } = require('../controllers/Technique');
const { default: ActiveRecall } = require('../controllers/ActiveRecall');
// User Auth
router.post('/register', User.create);
router.post('/login', User.login);
router.post('/validateToken', User.validateToken);
// Projects
router.get('/projects', authenticateJWT, Project.getAll);
router.post('/projects', authenticateJWT, Project.create);
router.delete('/projects/:id', authenticateJWT, Project.delete);
// Techniques
router.get('/projects/:id/techniques', authenticateJWT, Technique.getAll);
router.post('/projects/:id/techniques', authenticateJWT, Technique.create);
// Specific technique
router.get('/projects/:project_id/:technique_id', authenticateJWT, Technique.getFromId);
router.post('/projects/:project_id/:technique_id/active_recall', authenticateJWT, ActiveRecall.createFlashcard);
router.delete('/projects/:project_id/:technique_id/active_recall/:flashcard_id', authenticateJWT, ActiveRecall.removeFlashcard);
module.exports = router;
