import UserModel from "../models/UserModel"
import ProjectService from "./ProjectService"

export default class FlashcardService extends ProjectService {

    flashcards = []
    flashcardId: string

    constructor(userId, project_id, flashcardId) {
        super(userId, project_id)
        this.flashcardId = flashcardId
    }

    async complete(difficulty: (0|1|2|3)) {
        const user = await UserModel.findOne({_id: this.userId})
        const flashcard = user.projects.id(this.project_id).techniques.flashcards.id(this.flashcardId)
        flashcard.stage += 1


        let nextAnswer = Date.now()
        const daysInMs = 24*60*60*1000

        switch (difficulty) {
            case 0:
                nextAnswer += flashcard.stage*5*daysInMs
                break
            case 1:
                nextAnswer += flashcard.stage*2*daysInMs
                break
            case 2:
                nextAnswer += flashcard.stage*1*daysInMs
                break
            default:
                flashcard.stage = 0
                nextAnswer += daysInMs/24 // Next answer an hour in the future
        }

        flashcard.nextAnswer = nextAnswer

        user.save((err) => {
            if (err) throw err
            console.log(`Flashcard ${this.project_id} completed!`)
        })

        return flashcard.nextAnswer
    }

    async delete(): Promise<void> {
        const user = await UserModel.findOne({_id: this.userId})
        user.projects.id(this.project_id).techniques.flashcards.pull(this.flashcardId)

        user.save((err) => {
            if (err) throw err
            console.log(`Flashcard ${this.project_id} was deleted successfully!`)
        })
    }
}