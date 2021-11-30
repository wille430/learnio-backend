import { Project } from "../models/ProjectModel"
import PublicProjectModel from "../models/PublicProjectModel"

const PublicProjectsService = {
    createPublicProject: async (project: Project) => {
        const newPublicProject = await PublicProjectModel.create(project)
    },
    createShareUrl: async (projectId: string) => {
        const publicProject = await PublicProjectModel.find({_id: projectId})
    }
}

export default PublicProjectsService