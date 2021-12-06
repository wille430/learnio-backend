import mongoose from "mongoose"
import { Flashcard, Project } from "../models/ProjectModel"
import PublicProjectModel, { PublicProject } from "../models/PublicProjectModel"
import UserModel from "../models/UserModel"

const PublicProjectsService = {
    createPublicProject: async (user_id: string, project: Project): Promise<{ shareUrl: string, publicProject: PublicProject } | null> => {
        const publicProject = PublicProjectsService.convertRegularProjectToPublicProject(user_id, project)
        const existingProjects = await PublicProjectModel.count({ publicId: project._id })

        if (project.isCopy) {
            throw new Error('Origin type of project is public and cannot be converted to a public project')
        } else if (existingProjects >= 1) {
            throw new Error('Project is already public')
        }

        const newPublicProject = await PublicProjectModel.create(publicProject)
        const shareUrl = await PublicProjectsService.createShareUrl(newPublicProject._id)

        return {
            shareUrl: shareUrl,
            publicProject: newPublicProject
        }
    },
    createShareUrl: async (project_id: string) => {
        // Find project
        const publicProject = await PublicProjectModel.findById(project_id)

        // Create share url
        const shareUrl = `/publicprojects/${publicProject._id}/add`

        // Assign share url and save
        publicProject.shareUrl = shareUrl
        await publicProject.save()

        // return share url
        return shareUrl
    },
    copyPublicProject: async (user_id: string, public_project_id: string): Promise<void> => {
        const publicProject = await PublicProjectModel.findById(public_project_id)
        const user = await UserModel.findById(user_id)
        const projectWithPublicId = user.projects.find(project => project.publicId === public_project_id)

        if (Boolean(projectWithPublicId)) {
            throw new Error('Public project already exists in user projects')
        }

        if (user.username !== publicProject.owner) {
            user.projects.push({
                ...publicProject.toObject(),
                _id: new mongoose.Types.ObjectId(),
                publicOwner: publicProject.owner,
                publicId: publicProject._id,
                isCopy: true
            })

            await user.save()
        }
    },
    convertRegularProjectToPublicProject: (owner_id: string, project: Project): PublicProject => {
        const publicProject = {
            ...project.toObject(),
            owner: owner_id
        }
        delete publicProject._id

        // Clear flashcard dates
        // @ts-ignore
        publicProject.techniques.flashcards = project.techniques.flashcards.map(flashcard => {
            const newFlashcard = {
                ...flashcard.toObject(),
                nextAnswer: Date.now(),
                lastWrong: Date.now(),
                stage: 0
            }

            return newFlashcard
        })

        return publicProject
    },
    getAll: async () => {
        const projects = await PublicProjectModel.find({})

        const projectsWithOwnerUsername = await Promise.all(projects.filter(project => !!project.owner).map(async (project) => {
            console.log(project.owner)

            const user = await UserModel.findById(project.owner)
            const username = user?.username || 'Deleted user'

            return ({
                ...project.toObject(),
                owner: username
            })
        }))

        console.log(projectsWithOwnerUsername)

        return projectsWithOwnerUsername
    }
}

export default PublicProjectsService