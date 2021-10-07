const express = require('express')
const router = express.Router()
const checkJWT = require('../services/checkJWT')

router.get('/', async (req, res) => {
    const headers = req.headers
    const { authorization } = headers
    const authorized = await checkJWT(authorization)
    
    if (!authorized) return res.status(400).send('Unauthorized')
    res.send({})
})

module.exports = router