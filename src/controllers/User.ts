import { check, validationResult } from 'express-validator'
import UserModel from '../models/User'
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const { TOKEN_KEY } = process.env

const User = {
    create: [
        check('username')
            .exists()
            .withMessage('Användarnamnet kan inte vara tomt')
            .isLength({ min: 3 })
            .withMessage('Användarnamnet måste minst innehålla 3 bokstäver')
            .custom(async username => {
                const usernameExists = await User.isFieldInUse('username', username)
                if (usernameExists) {
                    throw new Error('Användarnamnet är upptaget')
                } else {
                    return true
                }
            }),
        check('password')
            .exists()
            .withMessage('Lösenordet kan inte vara tomt')
            .isStrongPassword()
            .withMessage('Lösenord är för svakt. Använd ett starkare lösenord'),
        check('email')
            .exists()
            .withMessage('Mejlfältet kan inte vara tomt')
            .isEmail()
            .withMessage('Mejlen är inte giltig')
            .custom(async email => {
                const emailExists = await User.isFieldInUse('email', email)
                if (emailExists) {
                    throw new Error('E-posten är upptagen')
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
                res.status(201).json(user)
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
            .withMessage('Användarnamnet kan inte vara tomt')
            .custom(async username => {
                const userExists = await User.isFieldInUse('username', username)
                if (!userExists) {
                    throw new Error('Felaktigt användarnamn eller lösenord')
                } else {
                    return true
                }
            }),
        check('password')
            .exists()
            .withMessage('Lösenordet kan inte vara tomt')
            .custom(async (password, { req }) => {
                const validPassword = await User.isValidPassword(req.body.username, password)
                if (!validPassword) {
                    throw new Error('Felaktigt användarnamn eller lösenord')
                } else {
                    return false
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
                console.log({ username, password })

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
        return bcrypt.compare(user.password, password)
    },
}

export default User