"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectSchema = exports.techniqueSchema = exports.spacedRepetitionSchema = exports.flashcard = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.flashcard = new mongoose_1.default.Schema({
    question: { type: String, required: true },
    answer: { type: String, default: '' },
    lastWrong: { type: Date, default: Date.now() },
    stage: { type: Number, default: 0 }
}, {
    timestamps: true
});
exports.spacedRepetitionSchema = new mongoose_1.default.Schema({
    techniqueType: { type: String, default: 'active_recall' },
    flashcards: [exports.flashcard]
});
exports.techniqueSchema = new mongoose_1.default.Schema({
    data: exports.spacedRepetitionSchema
}, {
    timestamps: true
});
exports.projectSchema = new mongoose_1.default.Schema({
    title: { type: String },
    selectedTechniques: [{ type: String, enum: ['spaced_repetition', 'active_recall'] }],
    techniques: [exports.spacedRepetitionSchema]
}, {
    timestamps: true
});
