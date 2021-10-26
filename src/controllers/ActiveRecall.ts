import { check, validationResult } from "express-validator"
import getUserFromId from "../services/getUserFromId"
import Project from "./Project"

const ActiveRecall = {
    createFlashcard: [
        check('question', 'Question cannot be empty')
            .exists(),
        async (req: any, res: any) => {
            // Validate req
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(422).jsonp(errors.array())
            }

            // Get technique
            const {project_id, technique_id} = req.params
            const user = await getUserFromId(req, res)
            const technique = user.projects.id(project_id).techniques.id(technique_id)
            if (!technique) return res.status(404).send('Could not find technique or project')

            // Get fields
            const { question, answer } = req.body

            // Create flashcard
            const newFlashcard = technique.flashcards.create({
                question: question,
                answer: answer
            })

            technique.flashcards.push(newFlashcard)

            // Save user
            await user.save()

            // Return OK
            res.sendStatus(201)
        }
    ],
    removeFlashcard: async (req: any, res: any) => {
        const {project_id, technique_id, flashcard_id} = req.params
        // Get technique
        const user = await getUserFromId(req, res)
        const technique = user.projects.id(project_id)?.techniques.id(technique_id)
        if (!technique) return res.status(404).send('Could not find technique or project')

        // Remove flashcard
        technique.flashcards = technique.flashcards.pull(flashcard_id)
        user.save((err) => {
            if (err) return res.status(500).send(err.message)
            res.sendStatus(200)
        })
    },
}

export default ActiveRecall