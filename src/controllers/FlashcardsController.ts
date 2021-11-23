import { check, validationResult } from "express-validator"
import FlashcardService from "../services/FlashcardService"
import ProjectService from "../services/ProjectService"

const ActiveRecall = {
    createFlashcard: [
        check("project_id")
            .exists()
            .withMessage("Project ID must be provided"),
        check('question', 'Question cannot be empty')
            .exists(),
        check('answer', 'Answer cannot be empty')
            .exists(),
        async (req: any, res: any) => {
            // Validate req
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(422).jsonp(errors.array())
            }

            const { user_id } = req.user
            const { project_id, technique_id } = req.params
            const { question, answer } = req.body

            const newFlashcard = new ProjectService(user_id, project_id).createFlashcard(question, answer)


            // Return OK
            res.status(201).json(newFlashcard)
        }
    ],
    removeFlashcard: [
        check("project_id")
            .exists()
            .withMessage("Project ID must be provided"),
        check("flashcard_id")
            .exists()
            .withMessage("Flashcard ID must be provided"),
        async (req: any, res: any) => {
            const { user_id } = req.user
            const { project_id, technique_id, flashcard_id } = req.params

            await new FlashcardService(user_id, project_id, flashcard_id).delete()

            res.sendStatus(200)
        }
    ],
    completeFlashcard: [
        check("project_id")
            .exists()
            .withMessage("Project ID must be provided"),
        check("flashcard_id")
            .exists()
            .withMessage("Flashcard ID must be provided"),
        async (req, res) => {
            // Validate req
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(422).jsonp(errors.array())
            }

            const { user_id } = req.user
            const { project_id, flashcard_id } = req.params

            await new FlashcardService(user_id, project_id, flashcard_id).complete()

            res.sendStatus(200)
        }
    ],
    getAll: [
        check("project_id")
            .exists()
            .withMessage("Project ID must be provided"),
        async (req, res) => {
            // Validate req
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(422).jsonp(errors.array())
            }

            const { user_id } = req.user
            const { project_id } = req.params

            const flashcards = await new ProjectService(user_id, project_id).getAllFlashcards()

            res.status(200).json(flashcards)
        }
    ],
    next: async (req, res) => {
        const { user_id } = req.user
        const { project_id } = req.params

        const nextFlashcard = await new ProjectService(user_id, project_id).getNextFlashcard()

        res.status(200).json(nextFlashcard)
    }
}

export default ActiveRecall