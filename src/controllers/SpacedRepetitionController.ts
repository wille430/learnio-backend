import { check, validationResult } from "express-validator"
import FlashcardService from "../services/FlashcardService"
import getUserFromId from "../services/getUserFromId"
import SpacedRepetitionService from "../services/SpacedRepetitionService"
import Project from "./ProjectController"

const ActiveRecall = {
    createFlashcard: [
        check("project_id")
            .exists()
            .withMessage("Project ID must be provided"),
        check("technique_id")
            .exists()
            .withMessage("Technique ID must be provided"),
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

            const newFlashcard = new SpacedRepetitionService(user_id, project_id, technique_id).createFlashcard(question, answer)


            // Return OK
            res.status(201).json(newFlashcard)
        }
    ],
    removeFlashcard: [
        check("project_id")
            .exists()
            .withMessage("Project ID must be provided"),
        check("technique_id")
            .exists()
            .withMessage("Technique ID must be provided"),
        check("flashcard_id")
            .exists()
            .withMessage("Flashcard ID must be provided"),
        async (req: any, res: any) => {
            const { user_id } = req.user
            const { project_id, technique_id, flashcard_id } = req.params

            await new FlashcardService(user_id, project_id, technique_id, flashcard_id).delete()

            res.sendStatus(200)
        }
    ],
    completeFlashcard: [
        check("project_id")
            .exists()
            .withMessage("Project ID must be provided"),
        check("technique_id")
            .exists()
            .withMessage("Technique ID must be provided"),
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
            const { project_id, technique_id, flashcard_id } = req.params

            await new FlashcardService(user_id, project_id, technique_id, flashcard_id).complete()
        }
    ]
}

export default ActiveRecall