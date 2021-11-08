import UserModel from "../models/UserModel"
import ProjectService from "./ProjectService"
import SpacedRepetitionService from "./SpacedRepetitionService"

export default class FlashcardService extends SpacedRepetitionService {

    flashcards = []
    flashcardId: string

    constructor(userId, projectId, techniqueId, flashcardId) {
        super(userId, projectId, techniqueId)
        this.flashcardId = flashcardId
    }

    async complete(offsetDays = 7) {
        const user = await UserModel.findOne({_id: this.userId})
        const flashcard = user.projects.id(this.projectId).techniques.spaced_repetition.id(this.techniqueId).flashcards.id(this.flashcardId)
        flashcard.nextAnswer = Date.now() + offsetDays*24*60*60*1000

        user.save((err) => {
            if (err) throw err
            console.log(`Flashcard ${this.projectId} completed!`)
        })

        return flashcard.nextAnswer
    }

    async delete(): Promise<void> {
        const user = await UserModel.findOne({_id: this.userId})
        user.projects.id(this.projectId).techniques.spaced_repetition.id(this.techniqueId).flashcards.pull(this.flashcardId)

        user.save((err) => {
            if (err) throw err
            console.log(`Flashcard ${this.projectId} was deleted successfully!`)
        })
    }
}