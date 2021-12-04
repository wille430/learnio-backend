import { check, validationResult } from "express-validator"
import PublicProjectModel from "../models/PublicProjectModel"
import ProjectService from "../services/ProjectService"
import PublicProjectsService from "../services/PublicProjectsService"

const PublicProjectsController = {
    makePublic: [
        check("project_id")
            .exists()
            .withMessage("You must provide a project"),
        async (req, res) => {

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(422).jsonp(errors.array())
            }

            const { project_id } = req.body
            const { user_id } = req.user

            const project = await new ProjectService(user_id, project_id).get()

            const data = await PublicProjectsService.createPublicProject(user_id, project)

            res.status(201).json(data)
        }
    ],
    copyPublicProject: [
        check("public_project_id")
            .exists()
            .withMessage("Invalid public project id"),
        async (req, res) => {

            const { user_id } = req.user
            const { public_project_id } = req.params

            await PublicProjectsService.copyPublicProject(user_id, public_project_id)

            res.sendStatus(200)
        }
    ],
    getAll: async (req, res) => {
        const projects = await PublicProjectsService.getAll()

        res.json(projects)
    }
}

export default PublicProjectsController