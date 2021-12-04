const express = require('express')
const router = express.Router()
const authenticateJWT = require('../services/authenticateJWT')

const { default: User } = require('../controllers/UserController')
const { default: Project } = require('../controllers/ProjectController')
const { default: Technique } = require('../controllers/TechniqueController')
const { default: FlashcardsController } = require('../controllers/FlashcardsController')
const { default: PublicProjectsController } = require('../controllers/PublicProjectsController')

// User Auth
router.post('/login', User.login)
router.post('/register', User.create)
router.post('/validateToken', User.validateToken)

// Projects
router.get('/projects', authenticateJWT, Project.getAll)
router.post('/projects', authenticateJWT, Project.create)
router.get('/projects/:project_id', authenticateJWT, Project.getFromId)
router.delete('/projects/:project_id', authenticateJWT, Project.delete)

// Techniques
router.get('/projects/:project_id/techniques', authenticateJWT, Technique.getAll)
router.post('/projects/:project_id/techniques', authenticateJWT, Technique.create)
router.delete('/projects/:project_id/:technique_id', authenticateJWT, Technique.delete)

// Specific technique
router.get('/projects/:project_id/flashcards/next', authenticateJWT, FlashcardsController.next)
router.get('/projects/:project_id/flashcards', authenticateJWT, FlashcardsController.getAll)
router.post('/projects/:project_id/flashcards', authenticateJWT, FlashcardsController.createFlashcard)
router.delete('/projects/:project_id/flashcards/:flashcard_id', authenticateJWT, FlashcardsController.removeFlashcard)
router.post('/projects/:project_id/flashcards/:flashcard_id/complete', authenticateJWT, FlashcardsController.completeFlashcard)

// Public Projects
router.post('/publicprojects/:public_project_id/add', authenticateJWT, PublicProjectsController.copyPublicProject)
router.post('/publicprojects/share', authenticateJWT, PublicProjectsController.makePublic)
router.get('/publicprojects', authenticateJWT, PublicProjectsController.getAll)

module.exports = router