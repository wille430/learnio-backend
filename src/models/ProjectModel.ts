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


interface SpacedRepetition extends mongoose.Types.Subdocument {
    techniqueType: 'spaced_repetition',
    flashcards: mongoose.Types.DocumentArray<Flashcard>
}

export const spacedRepetitionSchema = new mongoose.Schema<SpacedRepetition>({
    techniqueType: { type: String, default: 'spaced_repetition' },
    flashcards: [flashcard]
})
export const feynmanTechniqueSchema = new mongoose.Schema({
    techniqueType: { type: String, default: 'feynman_technique' },
    flashcards: [flashcard]
})

export const techniqueSchema = new mongoose.Schema({
    data: spacedRepetitionSchema
}, {
    timestamps: true
})


export interface Project extends mongoose.Types.Subdocument {
    _id?: string,
    title: string,
    selectedTechniques: string[],
    techniques?: {
        'spaced_repetition': mongoose.Types.DocumentArray<SpacedRepetition>,
        'feynman_technique': any[],
        'intervalled_training': any[]
    }
}

export interface ProjectModel {
    projects: mongoose.Types.Array<Project>
}


export const projectSchema = new mongoose.Schema<Project>({
    title: { type: String },
    selectedTechniques: [{ type: String, enum: ['spaced_repetition', 'feynman_technique', 'intervalled_training'] }],
    techniques: {
        'spaced_repetition': [spacedRepetitionSchema],
        'feynman_technique': [feynmanTechniqueSchema],
        'intervalled_training': [feynmanTechniqueSchema]
    }
}, {
    timestamps: true
})