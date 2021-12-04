import { flashcard, Project, ProjectData } from "./ProjectModel";
import mongoose from 'mongoose'

export interface PublicProject extends ProjectData {
    owner: string,
    shareUrl?: string
}

export const publicProjectSchema = new mongoose.Schema<PublicProject>({
    title: { type: String },
    selectedTechniques: [{ type: String, enum: ['flashcards'] }],
    techniques: {
        'flashcards': [flashcard],
    },
    shareUrl: { type: String },
    owner: { type: String }
}, {
    timestamps: true
})

export default mongoose.model('publicProjects', publicProjectSchema)