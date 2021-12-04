import mongoose from "mongoose"
import { Flashcard, Project } from "../models/ProjectModel"
import PublicProjectModel, { PublicProject } from "../models/PublicProjectModel"
import UserModel from "../models/UserModel"

const PublicProjectsService = {
    createPublicProject: async (user_id: string, project: Project): Promise<{ shareUrl: string, publicProject: PublicProject }> => {
        const publicProject = PublicProjectsService.convertRegularProjectToPublicProject(user_id, project)

        console.log({ publicProject })

        const newPublicProject = await PublicProjectModel.create(publicProject)
        const shareUrl = await PublicProjectsService.createShareUrl(newPublicProject._id)

        return {
            shareUrl: shareUrl,
            publicProject: newPublicProject
        }
    },
    createShareUrl: async (projectId: string) => {
        // Find project
        const publicProject = await PublicProjectModel.findById(projectId)

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

        user.projects.push(publicProject)

        await user.save()
    },
    convertRegularProjectToPublicProject: (owner_id: string, project: Project): PublicProject => {
        const publicProject = {
            ...project.toObject(),
            owner: owner_id
        }
        delete publicProject._id

        console.log(publicProject)

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