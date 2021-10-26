import { check, validationResult } from "express-validator"
import getUserFromId from "../services/getUserFromId"
import Project from "./Project"

const ActiveRecall = {
    createFlashcard: [
        check('question', 'Question cannot be empty')
            .exists(),
        Project.validateTechniqueId,
        async (req: any, res: any) => {
            // Validate req
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(422).jsonp(errors.array())
            }

            // Get technique
            const { technique, project } = req
            // Get fields
            const { question, answer } = req.body

            // Create flashcard
            const newFlashcard = technique.flashcards.create({
                question: question,
                answer: answer
            })


            technique.flashcards.push(newFlashcard)
            project.techniques["spaced_repetition"].id(technique._id).remove()
            project.techniques["spaced_repetition"].push(technique)

            // Save user
            const user = await getUserFromId(req, res)
            console.log({
                new_project: project,
                old_project: user.projects.id(project._id)
            })

            // remove old project
            user.projects = user.projects.filter(x => x._id !== project._id)
            // add new project
            user.projects.push(JSON.parse(JSON.stringify(project)))
            console.log({ new_user: user })
            await user.save()


            // Return OK
            res.status(201).json(newFlashcard)
        }
    ],
    removeFlashcard: [
        Project.validateTechniqueId,
        async (req: any, res: any) => {
            const { flashcard_id } = req.params
            // Get technique
            const user = await getUserFromId(req, res)
            const { technique } = req

            // Remove flashcard
            technique.flashcards = technique.flashcards.pull(flashcard_id)
            user.save((err) => {
                if (err) return res.status(500).send(err.message)
                res.sendStatus(200)
            })
        }
    ],
}

export default ActiveRecall