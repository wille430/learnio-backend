import User from "../models/User"

export default class FlashcardService {

    flashcards = []

    user_id: string
    project_id: string
    technique_id: string

    constructor(user_id, project_id, technique_id) {
        this.user_id = user_id
        this.project_id = project_id
        this.technique_id = technique_id
    }

    async complete(flashcard_id, offsetDays = 7) {
        await User.update(
            {
                _id: this.user_id,
                "projects._id": this.project_id,
                "projects.techniques.spaced_repetition._id": this.technique_id,
                "projects.techniques.spaced_repetition.flashcards._id": flashcard_id
            },
            {
                $set: {
                    "projects.techniques.spaced_repetition.flashcards.nextAnswer": Date.now() + offsetDays*24*60*60*1000
                }
            }
        )
    }
}