import { validationResult, check } from "express-validator"
import getUserFromId from "../services/getUserFromId"
import ProjectService from "../services/ProjectService"
import TechniqueService from "../services/TechniqueService"
import Project from "./ProjectController"
import User from "./UserController"

const Technique = {
    getAll: [
        User.validateproject_id,
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
        check("project_id", "Project ID is required")
            .exists(),
        check('type', 'Type is not valid')
            .exists()
            .isIn(['spaced_repetition', 'feynman_technique', 'intervalled_training']),
        async (req: any, res: any) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(422).jsonp(errors.array())
            }

            const { user_id } = req.user
            const { type } = req.body
            const { project_id } = req.params

            const newTechnique = await new ProjectService(user_id, project_id).addTechnique(type)

            res.status(201).json(newTechnique)

        }
    ],
    delete: [
        check("project_id", "Project ID is required")
            .exists(),
        check("technique_id", "Technique ID is required")
            .exists(),
        async (req, res) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(422).jsonp(errors.array())
            }

            const { user_id } = req.user
            const { project_id, technique_id } = req.params

            console.log(user_id, project_id, technique_id)

            await new TechniqueService(user_id, project_id, technique_id).delete()

            res.sendStatus(200)
        }
    ]
}


export default Technique