import mongoose from 'mongoose'

export interface Flashcard extends mongoose.Types.Subdocument {
    question: string,
    answer: string,
    lastWrong: number,
    nextAnswer: number,
    stage: number,
    createdAt: Date,
    updatedAt: Date,
}

export const flashcard = new mongoose.Schema<Flashcard>({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    lastWrong: { type: Number, default: Date.now() },
    nextAnswer: { type: Number, default: Date.now() },
    stage: { type: Number, default: 0 }
}, {
    timestamps: true
})


export interface ProjectData {
    _id: string,
    title: string,
    selectedTechniques: string[],
    techniques?: {
        flashcards: mongoose.Types.DocumentArray<Flashcard>
    }
}

export type Project = ProjectData & mongoose.Types.Subdocument

export interface ProjectModel {
    projects: mongoose.Types.Array<Project>
}

export const projectSchema = new mongoose.Schema<Project>({
    title: { type: String },
    selectedTechniques: [{ type: String, enum: ['flashcards'] }],
    techniques: {
        'flashcards': [flashcard],
    }
}, {
    timestamps: true
})