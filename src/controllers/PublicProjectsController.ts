import { check } from "express-validator"
import { Project } from "../models/ProjectModel"
import PublicProjectsService from "../services/PublicProjectsService"


const PublicProjectsController = {
    makePublic: [
        check("project")
            .exists()
            .withMessage("You must provide a project"),
        async (req, res) => {

            const { project }: {project: Project} = req.body
            const shareUrl = await PublicProjectsService.createPublicProject(project)

            res.send(shareUrl)
        }
    ],
    copyPublicProject: (req, res) => {

    }
}

export default PublicProjectsController