import { check, validationResult } from 'express-validator'
import UserModel from '../models/User'
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const { TOKEN_KEY } = process.env

const User = {
    create: [
        check('username', 'Username must be longer than 3 characters long')
            .exists()
            .isLength({ min: 3 }),
        check('password')
            .exists()
            .withMessage('Password is required')
            .isStrongPassword()
            .withMessage('Password not strong enough'),
        async (req: any, res: any) => {
            // Validate input
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(422).jsonp(errors.array())
            }

            try {
                // Get and validate input
                const { username, password } = req.body
                if (!(username && password)) return res.status(400).send('Username and password is required')

                // Look for existing user
                const oldUser = await UserModel.findOne({ username })
                if (oldUser) return res.status(409).send('Username already exists')

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
        check('username', 'Username is required')
            .exists(),
        check('password')
            .exists()
            .withMessage('Password is required'),
        async (req: any, res: any) => {
            try {
                // Validate username and password
                const { username, password } = req.body
                console.log({username, password})

                // Check for existing user
                const oldUser = await UserModel.findOne({ username })
                if (!oldUser) return res.status(404).send('User does\'nt exist')

                // Check if password is matching
                if (!bcrypt.compare(oldUser.password, password)) return res.status(401).send('Incorrect password')

                // Create new JWT
                const token = jwt.sign({ user_id: oldUser._id, email: oldUser.email }, process.env.TOKEN_KEY, {
                    expiresIn: "2h",
                })

                // Save JWT to user
                oldUser.token = token
                oldUser.save()

                res.status(200).send(token)
            } catch (e) {
                console.log(e)
                res.sendStatus(500)
            }
        }
    ]
}

export default User