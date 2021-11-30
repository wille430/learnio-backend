import { projectSchema, ProjectModel } from "./ProjectModel";
import mongoose from 'mongoose'

export const publicProjectSchema = projectSchema

export default ProjectModel.discriminator('public')