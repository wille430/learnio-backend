import mongoose from 'mongoose'

export const flashcard = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, default: '' },
    lastWrong: { type: Date, default: Date.now() },
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