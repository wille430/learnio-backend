const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

router.post('/register', async (req, res) => {
    try {
        // Get and validate input
        const { username, password } = req.body
        if (!(username && password)) return res.status(400).send('Username and password is required')

        // Look for existing user
        const oldUser = await mongoose.findOne({ username })
        if (oldUser) return res.status(409).send('Username already exists')

        const user = await User.create({
            username, password: bcrypt.hash(password, 10)
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
    }
})

router.post('/login', async (req, res) => {
    try {
        // Validate input
        const { username, password } = req.body
        if (!(username, password)) return res.status(400).send('All fields are required')

        // Find matching username
        const oldUser = mongoose.findOne({ username })
        if (!oldUser) return res.status(404).send('Username does not exist')

        // Check if password matches
        if (!bcrypt.compareSync(password, oldUser.password)) return res.status(401).send('Password is incorrect')

        // Create jwt token
        const token = jwt.sign({ user_id: user._id }, TOKEN_KEY, {
            expiresIn: "2h"
        })

        oldUser.token = token
        oldUser.save()

        res.status(200).send(token)


    } catch (e) {
        console.log(e)
    }
})

module.exports = router