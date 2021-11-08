import mongoose from 'mongoose'
import { Project, ProjectModel, projectSchema } from '../models/Project'

interface User extends Document {
    username: string,
    password: string,
    projects: mongoose.Types.DocumentArray<Project>
}

const userSchema = new mongoose.Schema<User>({
    username: {type: String, unique: true},
    password: {type: String},
    projects: [projectSchema]
})

export type UserModel = User & Document & ProjectModel & Omit<User, 'projects'>

export default mongoose.model<UserModel>("user", userSchema)