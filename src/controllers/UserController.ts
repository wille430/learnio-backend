import { check, validationResult } from 'express-validator'
import getUserFromId from '../services/getUserFromId'
import UserService from '../services/UserService'
import jwt from 'jsonwebtoken'

const User = {
    create: [
        check('username')
            .exists()
            .withMessage('Username cannot be empty')
            .isLength({ min: 3 })
            .withMessage('Username must be at least 3 characters long')
            .custom(async username => {
                const exists = await UserService.userExists(username)
                if (exists) throw new Error("Username is already taken")
            }),
        check('password')
            .exists()
            .withMessage('Password cannot be empty')
            .isStrongPassword()
            .withMessage('Password to weak'),
        check('repassword')
            .custom(async (repassword, { req }) => {
                const { password } = req.body
                if (!(password === repassword)) throw new Error('The passwords must match!')
            }),
        async (req: any, res: any) => {
            // Validate input
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(422).jsonp(errors.array())
            }

            const { username, password } = req.body

            const token = await UserService.create(username, password)

            // Return token
            res.status(201).send(token)
        }
    ],
    delete: async (req: Express.Request, res: Express.Response) => {
        // Delete user
    },
    login: [
        check('username')
            .exists()
            .withMessage('Username cannot be empty')
            .custom(async username => {
                const exists = await UserService.userExists(username)
                if (!exists) throw new Error("Invalid username or password")
            }),
        check('password')
            .exists()
            .withMessage('Password cannot be empty')
            .custom(async (password, { req }) => {
                const { username } = req.body                
                const passwordMatches = await UserService.passwordMatches(username, password)
                if (!passwordMatches) throw new Error("Invalid username or password")
            }),
        async (req: any, res: any) => {
            // Validate input

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(422).jsonp(errors.array())
            }

            const { username, password } = req.body

            const token = await UserService.login(username, password)

            res.status(200).send(token)
        }
    ],
    validateToken: async (req, res) => {
        const { token } = req.body
        if (!token) return res.sendStatus(400)

        jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
            if (err) {
                return res.sendStatus(403)
            }
            res.sendStatus(200)
        })
    },
    validateProjectId: [
        check('project_id')
            .exists()
            .withMessage("Project ID is required"),
        async (req, res, next) => {
            // Validate req
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(422).jsonp(errors.array())
            }
            const { project_id } = req.params

            // Get technique
            const user = await getUserFromId(req, res)
            const project = user.projects.id(project_id)
            console.log({ projects: user.projects })
            if (!project) return res.sendStatus(404)
            req.project = project
            next()
        }
    ]
}

export default User