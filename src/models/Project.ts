import mongoose from 'mongoose'

export const flashcard = new mongoose.Schema({
    question: {type: String, required: true},
    answer: {type: String, default: ''},
    lastWrong: {type: Date, default: Date.now()},
    stage: {type: Number, default: 0}
}, {
    timestamps: true
})

export const spacedRepetitionSchema = new mongoose.Schema({
    techniqueType: {type: String, default: 'active_recall'},
    flashcards: [flashcard]
})

export const techniqueSchema = new mongoose.Schema({
    
    data: spacedRepetitionSchema
}, {
    timestamps: true
})

export const projectSchema = new mongoose.Schema({
    title: {type: String},
    selectedTechniques: [{type: String, enum: ['spaced_repetition', 'active_recall']}],
    techniques: [spacedRepetitionSchema]
}, {
    timestamps: true
})