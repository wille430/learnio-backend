import { User } from '../models/UserModel'

/**
 * Must be used after authenticateJWT middleware
**/

const isAdmin = (req, res, next) => {

    const user: User | null = req.user

    if (user?.role === 'admin') {
        next()
    } else {
        res.status(401).json([
            {
                code: 401,
                msg: "Invalid role for requested endpoint"
            }
       ])
    }
}

module.exports = isAdmin