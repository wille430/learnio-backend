import getUserFromId from "../services/getUserFromId"


const Project = {
    create: async (req: any, res: any) => {
        // Validate req
        const { title, selectedTechniques } = req.body
        if (!(title && selectedTechniques) || !Array.isArray(selectedTechniques)) return res.status(400).send('Missing required fields')

        // Get user and create new project
        const user = await getUserFromId(req, res)

        const newProject = user.projects.create({
            title: title,
            selectedTechniques: selectedTechniques
        })

        user.projects.push(newProject)
        await user.save()

        // Return OK
        res.status(201).json(newProject)
    },
    delete: async (req: any, res: any) => {
        const user = await getUserFromId(req, res)
        const project_id = req.params.id

        user.projects = user.projects.pull(project_id)
        user.save()
        
        res.sendStatus(200)
    },
    getAll: async (req: any, res: any) => {
        const user = await getUserFromId(req, res)

        // Get user projects and return
        const projects = user.projects

        res.status(200).json(projects)
    },
}

export default Project