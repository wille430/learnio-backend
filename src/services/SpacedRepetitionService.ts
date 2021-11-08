import { Flashcard } from "../models/Project";
import UserModel from "../models/UserModel";
import Technique from "./Technique";

export default class SpacedRepetitionService extends Technique {
    type = "spaced_repetition"

    constructor(userId, projectId, techniqueId) {
        super(userId, projectId, techniqueId)
    }

    async createFlashcard(question, answer): Promise<Flashcard> {
        const user = await UserModel.findOne({ _id: this.userId })
        const technique = user.projects.id(this.projectId).techniques.spaced_repetition.id(this.techniqueId)

        const newFlashcard = technique.flashcards.create({
            question: question,
            answer: answer
        })

        user.projects.id(this.projectId).techniques.spaced_repetition.id(this.techniqueId).flashcards.push(newFlashcard)

        user.save((err) => {
            if (err) throw err
            console.log(`Flashcard ${newFlashcard._id} was successfully created!`)
        })

        return newFlashcard
    }
}