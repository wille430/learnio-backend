const jwt = require('jsonwebtoken')

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization

    // Check if JWT was provided
    if (authHeader) {
        const token = authHeader.split(' ')[1]
        // Check if token is valid
        jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
            if (err) {
                return res.sendStatus(403)
            }
            req.user = user
            next()
        })
    } else {
        res.sendStatus(401)
    }
}

module.exports = authenticateJWT