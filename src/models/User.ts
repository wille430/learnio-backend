const mongoose = require('mongoose')
import { projectSchema } from '../models/Project'

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    password: {type: String},
    token: {type: String},
    projects: [projectSchema]
})

export default mongoose.model("user", userSchema)