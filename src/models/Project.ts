import mongoose from 'mongoose'

interface Flashcard {
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
    answer: { type: String, default: '' },
    lastWrong: { type: Number, default: Date.now() },
    nextAnswer: { type: Number, default: Date.now() },
    stage: { type: Number, default: 0 }
}, {
    timestamps: true
})

export const spacedRepetitionSchema = new mongoose.Schema({
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

export const projectSchema = new mongoose.Schema({
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