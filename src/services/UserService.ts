import UserModel, { User } from "../models/UserModel"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import InputError from "./InputError"

export default class UserService {
    userId: string

    constructor(userId) {
        this.userId = userId
    }

    async user(): Promise<User> {
        const user: User = await UserModel.findOne({ _id: this.userId })
        return user
    }

    async saveUser(user): Promise<void> {
        await user.save((err) => {
            if (err) throw err
        })
    }

    static async login(username: string, password: string): Promise<string | null> {
        // Find user
        const user = await UserModel.findOne({ username })

        const passwordMatches = await await bcrypt.compare(password, user.password)
        if (!passwordMatches) return

        // Create and return JWT-token
        return this.signToken(user._id)
    }

    static async create(username, password): Promise<string | InputError> {

        const encryptedPassword = await bcrypt.hash(password, 10)

        // Create new user
        const user = await UserModel.create({
            username, password: encryptedPassword
        })

        // Create and return JWT-token
        return this.signToken(user._id)
    }

    static signToken(userId): string {
        return jwt.sign({ user_id: userId }, process.env.TOKEN_KEY, {
            expiresIn: "2h"
        })
    }

    static async userExists(username) {
        return await UserModel.exists({ username })
    }

    static async passwordMatches(username, inputPassword) {
        const user = await UserModel.findOne({ username })
        const referencePassword = user.password
        return await bcrypt.compare(inputPassword, referencePassword)
    }

    async getAllProjects() {
        const user = await UserModel.findOne({ _id: this.userId })
        return user.projects
    }
}