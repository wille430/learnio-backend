import { Project } from "../models/ProjectModel";
import UserModel from "../models/UserModel";
import UserService from "./UserService";

export default class ProjectService extends UserService {
    projectId: string

    constructor(userId, projectId?) {
        super(userId)
        this.projectId = projectId
    }

    async create(projectName: string, selectedTechniques: string[]): Promise<Project> {
        const user = await UserModel.findOne({ _id: this.userId })

        const newProject = user.projects.create({
            title: projectName,
            selectedTechniques: selectedTechniques
        })

        user.projects.push(newProject)

        user.save((err) => {
            if (err) throw err
            console.log(`Project ${newProject._id} was successfully created!`)
        })

        return newProject
    }

    async addTechnique(type) {
        const user = await UserModel.findOne({ _id: this.userId })
        const project = user.projects.id(this.projectId)

        const newTechnique = project.techniques[type].create({})

        user.projects.id(this.projectId).techniques[type].push(newTechnique)

        user.save((err) => {
            if (err) throw err
            console.log(`Technique ${newTechnique._id} was successfully created!`)
        })

        return newTechnique
    }

    async delete(): Promise<void> {
        const user = await UserModel.findOne({ _id: this.userId })
        user.projects.pull({ _id: this.projectId })

        user.save((err) => {
            if (err) throw err
            console.log(`Project ${this.projectId} was successfully deleted!`)
        })

    }

    async get(): Promise<Project> {
        const user = await UserModel.findOne({ _id: this.userId })

        const project = user.projects.id({ _id: this.projectId })

        return project
    }
}