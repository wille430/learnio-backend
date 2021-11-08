import { check, validationResult } from 'express-validator'
import UserModel from '../models/User'
import getUserFromId from '../services/getUserFromId'
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const { TOKEN_KEY } = process.env

const User = {
    create: [
        check('username')
            .exists()
            .withMessage('Username cannot be empty')
            .isLength({ min: 3 })
            .withMessage('Username must be at least 3 characters long')
            .custom(async username => {
                const usernameExists = await User.isFieldInUse('username', username)
                if (usernameExists) {
                    throw new Error('Username is already taken')
                } else {
                    return true
                }
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

            try {
                // Get and validate input
                const { username, password } = req.body

                const user = await UserModel.create({
                    username, password: await bcrypt.hash(password, 10)
                })

                // Create JWT-token
                const token = jwt.sign({ user_id: user._id }, TOKEN_KEY, {
                    expiresIn: "2h"
                })

                user.token = token

                // Return token
                res.status(201).send(token)
            } catch (e) {
                console.log(e)
                res.sendStatus(500)
            }
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
                const userExists = await User.isFieldInUse('username', username)
                if (!userExists) {
                    throw new Error('Invalid password or username')
                } else {
                    return true
                }
            }),
        check('password')
            .exists()
            .withMessage('Password cannot be empty')
            .custom(async (password, { req }) => {
                const validPassword = await User.isValidPassword(req.body.username, password)
                if (!validPassword) {
                    throw new Error('Invalid password or username')
                } else {
                    return true
                }
            }),
        async (req: any, res: any) => {
            // Validate input
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(422).jsonp(errors.array())
            }
            try {
                // Validate username and password
                const { username, password } = req.body

                // Get existing user
                const user = await UserModel.findOne({ username })

                // Create new JWT
                const token = jwt.sign({ user_id: user._id, email: user.email }, process.env.TOKEN_KEY, {
                    expiresIn: "2h",
                })

                // Save JWT to user
                user.token = token
                user.save()

                res.status(200).send(token)
            } catch (e) {
                console.log(e)
                res.sendStatus(500)
            }
        }
    ],
    isFieldInUse: async (field: string, value: string) => {
        // Check for existing user
        const oldUser = await UserModel.findOne({ [field]: value })
        return !!oldUser
    },
    isValidPassword: async (username: string, password: string) => {
        // Check for existing user
        const user = await UserModel.findOne({ username })
        if (!user) return false
        // Compare passwords
        return await await bcrypt.compare(password, user.password)
    },
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
            console.log({projects: user.projects})
            if (!project) return res.sendStatus(404)
            req.project = project
            next()
        }
    ]
}

export default User