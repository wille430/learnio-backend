import { Flashcard, Project } from "../models/ProjectModel";
import UserModel from "../models/UserModel";
import UserService from "./UserService";

export default class ProjectService extends UserService {
    project_id: string

    constructor(userId: string, project_id?: string) {
        super(userId)
        this.project_id = project_id
    }

    async create(projectName: string, selectedTechniques: string[]): Promise<Project> {
        const user = await UserModel.findOne({ _id: this.userId })

        const newProject = user.projects.create({
            title: projectName,
            selectedTechniques
        })

        user.projects.push(newProject)

        await user.save()

        // await user.save(async (err) => {
        //     if (err) throw err
        //     console.log(`Project ${newProject._id} was successfully created!`)
        // })


        // Create techniques chosen in selectedTechniques
        // newProject.selectedTechniques.forEach(async techniqueVal => {
        //     await new ProjectService(this.userId, newProject._id.toString()).addTechnique(techniqueVal)
        //     // const newTechnique = await newProject.techniques[techniqueVal].create({})
        //     // newProject.techniques[techniqueVal].push(newTechnique)
        // })
        return newProject

    }

    async addTechnique(type: string) {
        const user = await UserModel.findOne({ _id: this.userId })
        const project = await this.get()

        const newTechnique = project.techniques[type].create({})

        user.projects.id(this.project_id).techniques[type].push(newTechnique)

        user.save((err) => {
            if (err) throw err
            console.log(`Technique ${newTechnique._id} was successfully created!`)
        })

        return newTechnique
    }

    async delete(): Promise<void> {
        const user = await UserModel.findOne({ _id: this.userId })
        user.projects.pull({ _id: this.project_id })

        user.save((err) => {
            if (err) throw err
            console.log(`Project ${this.project_id} was successfully deleted!`)
        })

    }

    async get(): Promise<Project> {
        const user = await UserModel.findById(this.userId)
        const project = user.projects.id(this.project_id)

        return project
    }

    async createFlashcard(question, answer): Promise<Flashcard> {
        const user = await UserModel.findById(this.userId)
        const flashcardsArray = user.projects.id(this.project_id).techniques.flashcards

        const newFlashcard = flashcardsArray.create({
            question: question,
            answer: answer
        })

        user.projects.id(this.project_id).techniques.flashcards.push(newFlashcard)

        user.save((err) => {
            if (err) throw err
            console.log(`Flashcard ${newFlashcard._id} was successfully created!`)
        })

        return newFlashcard
    }


    async getAllFlashcards() {
        const user = await UserModel.findById(this.userId)

        try {
            return user.projects.id(this.project_id).techniques.flashcards
        } catch (e) {
            console.log(e)
            return []
        }
    }

    async getNextFlashcard() {
        const user = await this.user()

        const nextFlashcard = user.projects.id(this.project_id).techniques.flashcards.sort((a, b) => {
            return a.nextAnswer - b.nextAnswer
        })[0]

        if (nextFlashcard.nextAnswer > Date.now()) {
            return null
        } else {
            return nextFlashcard
        }
    }
}