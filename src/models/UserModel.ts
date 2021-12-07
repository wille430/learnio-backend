import mongoose from 'mongoose'
import { Project, ProjectModel, projectSchema } from './ProjectModel'

export interface User extends Document {
    username: string,
    password: string,
    projects: mongoose.Types.DocumentArray<Project>,
    role: ('admin' | 'regular')
}

const userSchema = new mongoose.Schema<User>({
    username: { type: String, unique: true },
    password: { type: String },
    projects: [projectSchema],
    role: { type: String, enum: ['admin', 'regular'], default: 'regular' }
})

export type UserModel = User & Document & ProjectModel & Omit<User, 'projects'>

export default mongoose.model<UserModel>("user", userSchema)