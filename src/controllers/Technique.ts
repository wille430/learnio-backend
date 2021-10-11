import { validationResult, check } from "express-validator"
import getUserFromId from "../services/getUserFromId"

const Technique = {
    getAll: async (req: any, res: any) => {
        const project_id = req.params.id
        const user = await getUserFromId(req, res)

        // Get techniques in project
        const project = user.projects.id(project_id)
        if (!project) return res.status(404).send("Could not find project")
        const techniques = project.techniques

        res.status(200).json(techniques)

    },
    getFromId: async (req: any, res: any) => {
        const project_id = req.params.project_id
        const technique_id = req.params.technique_id

        const user = await getUserFromId(req, res)

        // Get techniques in project
        const project = user.projects.id(project_id)
        if (!project) return res.status(404).send("Could not find project")

        const technique = project.techniques.id(technique_id)
        if (!technique) return res.status(404).send("Could not find technique")

        res.status(200).json(technique)

    },
    create: [
        check('type', 'Type is not valid')
            .exists()
            .isIn(['spaced_repetition', 'active_recall']),
        async (req: any, res: any) => {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(422).jsonp(errors.array())
            }

            const project_id = req.params.id
            const user = await getUserFromId(req, res)

            const { type } = req.body

            // Get project with id
            const project = user.projects.id(project_id)
            if (!project) return res.status(404).send("Could not find project")

            // Create new technique
            const newTechnique = project.techniques.create({
                techniqueType: type
            })
            project.techniques.push(newTechnique)

            user.save()

            res.status(201).json(newTechnique)

        }
    ]
}


export default Technique