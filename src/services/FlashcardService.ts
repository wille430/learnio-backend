import UserModel from "../models/UserModel"
import ProjectService from "./ProjectService"

export default class FlashcardService extends ProjectService {

    flashcards = []
    flashcardId: string

    constructor(userId, projectId, flashcardId) {
        super(userId, projectId)
        this.flashcardId = flashcardId
    }

    async complete(offsetDays = 7) {
        const user = await UserModel.findOne({_id: this.userId})
        const flashcard = user.projects.id(this.projectId).techniques.flashcards.id(this.flashcardId)
        flashcard.nextAnswer = Date.now() + offsetDays*24*60*60*1000

        user.save((err) => {
            if (err) throw err
            console.log(`Flashcard ${this.projectId} completed!`)
        })

        return flashcard.nextAnswer
    }

    async delete(): Promise<void> {
        const user = await UserModel.findOne({_id: this.userId})
        user.projects.id(this.projectId).techniques.flashcards.pull(this.flashcardId)

        user.save((err) => {
            if (err) throw err
            console.log(`Flashcard ${this.projectId} was deleted successfully!`)
        })
    }
}