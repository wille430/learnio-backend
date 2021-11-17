import { check, validationResult } from "express-validator"
import ProjectService from "../services/ProjectService"
import TechniqueService from "../services/TechniqueService"
import UserService from "../services/UserService"
import User from "./UserController"


const Project = {
    create: [
        check('title')
            .exists()
            .withMessage('You must name your project'),
        check('selectedTechniques')
            .isArray({ min: 1 })
            .withMessage('You must select a technique')
            .custom(selectedTechniques => {
                const enums = ['flashcards']
                let valid_input = selectedTechniques.every(x => enums.includes(x))

                if (!valid_input) {
                    throw new Error("Invalid techniques. Valid techniques are: flashcards")
                }
                return true
            }),
        async (req: any, res: any) => {
            // Validate req
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(422).jsonp(errors.array())
            }

            const { user_id } = req.user
            const { title, selectedTechniques } = req.body

            const newProject = await new ProjectService(user_id).create(title, selectedTechniques)

            // Return OK
            res.status(201).json(newProject)
        }
    ],
    delete: [
        check("project_id", "Project ID is required"),
        async (req: any, res: any) => {
            // Validate req
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(422).jsonp(errors.array())
            }

            const { user_id } = req.user
            const { project_id } = req.params

            await new ProjectService(user_id, project_id)

        }
    ],
    getAll: async (req: any, res: any) => {
        const projects = await new UserService(req.user.user_id).getAllProjects()
        res.status(200).json(projects)
    },
    getFromId: async (req, res) => {
        const { user_id } = req.user
        const { project_id } = req.params
        const projects = await new ProjectService(user_id, project_id).get()
        res.status(200).json(projects)
    },
    validateTechniqueId: [
        check("technique_id", "Technique ID cannot be empty")
            .exists(),
        User.validateProjectId,
        async (req, res, next) => {
            // Validate req
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(422).jsonp(errors.array())
            }
            const { technique_id } = req.params

            // Get technique
            const { project } = req
            console.log({ project })
            let technique;
            Object.keys(project.techniques).forEach(tech_type => {
                project.techniques[tech_type].forEach(tech => tech.id === technique_id ? technique = tech : false)
            })
            if (!technique) return res.sendStatus(404)
            req.technique = technique
            next()
        }
    ]
}

export default Project