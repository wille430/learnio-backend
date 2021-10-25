import { validationResult, check } from "express-validator"
import getUserFromId from "../services/getUserFromId"
import Project from "./Project"
import User from "./User"

const Technique = {
    getAll: [
        User.validateProjectId,
        async (req: any, res: any) => {
            // Get techniques in project
            const { project } = req
            const techniques = project.techniques

            res.status(200).json(techniques)

        }
    ],
    getFromId: [
        Project.validateTechniqueId,
        async (req: any, res: any) => {


            const technique = req.technique
            if (!technique) return res.status(404).send("Could not find technique")

            res.status(200).json(technique)

        }
    ],
    create: [
        check('type', 'Type is not valid')
            .exists()
            .isIn(['spaced_repetition', 'feynman_technique', 'intervalled_training']),
        User.validateProjectId,
        async (req: any, res: any) => {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(422).jsonp(errors.array())
            }

            const user = await getUserFromId(req, res)

            const { type } = req.body
            const { project } = req

            // Create new technique
            const newTechnique = project.techniques[type].create({})
            project.techniques[type].push(newTechnique)

            user.save()

            res.status(201).json(newTechnique)

        }
    ],
}


export default Technique