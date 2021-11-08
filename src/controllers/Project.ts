import { check, validationResult } from "express-validator"
import getUserFromId from "../services/getUserFromId"
import User from "./User"


const Project = {
    create: [
        check('title')
            .exists()
            .withMessage('You must name your project'),
        check('selectedTechniques')
            .isArray({ min: 1 })
            .withMessage('You must select a technique')
            .custom(selectedTechniques => {
                const enums = ['spaced_repetition', 'feynman_technique', 'intervalled_training']
                let valid_input = selectedTechniques.every(x => enums.includes(x))

                if (!valid_input) {
                    throw new Error("Invalid techniques. Valid techniques are: spaced_repetition, feynman_technique, intervalled_training")
                }
                return true
            }),
        async (req: any, res: any) => {
            // Validate req
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(422).jsonp(errors.array())
            }

            const { title, selectedTechniques } = req.body

            // Get user and create new project
            const user = await getUserFromId(req, res)

            const newProject = user.projects.create({
                title: title,
                selectedTechniques: selectedTechniques
            })

            // Create techniques chosen in selectedTechniques
            selectedTechniques.forEach(async techniqueVal => {
                const newTechnique = await newProject.techniques[techniqueVal].create({})
                newProject.techniques[techniqueVal].push(newTechnique)
            })

            user.projects.push(newProject)
            await user.save()

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

            const user = await getUserFromId(req, res)
            const { project_id } = req.params

            user.projects = user.projects.pull(project_id)
            user.save()

            res.sendStatus(200)
        }
    ],
    getAll: async (req: any, res: any) => {
        const user = await getUserFromId(req, res)

        // Get user projects and return
        const projects = user.projects

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