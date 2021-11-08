const express = require('express')
const router = express.Router()
const authenticateJWT = require('../services/authenticateJWT')

const { default: User } = require('../controllers/UserController')
const { default: Project } = require('../controllers/ProjectController')
const { default: Technique } = require('../controllers/TechniqueController')
const { default: ActiveRecall } = require('../controllers/SpacedRepetitionController')

// User Auth
router.post('/login', User.login)
router.post('/register', User.create)
router.post('/validateToken', User.validateToken)

// Projects
router.get('/projects', authenticateJWT, Project.getAll)
router.post('/projects', authenticateJWT, Project.create)
router.delete('/projects/:project_id', authenticateJWT, Project.delete)

// Techniques
router.get('/projects/:project_id/techniques', authenticateJWT, Technique.getAll)
router.post('/projects/:project_id/techniques', authenticateJWT, Technique.create)
// router.delete

// Specific technique
router.get('/projects/:project_id/:technique_id', authenticateJWT, Technique.getFromId)
router.post('/projects/:project_id/:technique_id/active_recall', authenticateJWT, ActiveRecall.createFlashcard)
router.delete('/projects/:project_id/:technique_id/active_recall/:flashcard_id', authenticateJWT, ActiveRecall.removeFlashcard)
router.post('/projects/:project_id/:technique_id/active_recall/:flashcard_id/complete', authenticateJWT, ActiveRecall.completeFlashcard)

module.exports = router