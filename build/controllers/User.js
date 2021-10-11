"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { TOKEN_KEY } = process.env;
const User = {
    create: [
        (0, express_validator_1.check)('username', 'Username must be longer than 3 characters long')
            .exists()
            .isLength({ min: 3 }),
        (0, express_validator_1.check)('password')
            .exists()
            .withMessage('Password is required')
            .isStrongPassword()
            .withMessage('Password not strong enough'),
        async (req, res) => {
            // Validate input
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(422).jsonp(errors.array());
            }
            try {
                // Get and validate input
                const { username, password } = req.body;
                if (!(username && password))
                    return res.status(400).send('Username and password is required');
                // Look for existing user
                const oldUser = await User_1.default.findOne({ username });
                if (oldUser)
                    return res.status(409).send('Username already exists');
                const user = await User_1.default.create({
                    username, password: await bcrypt.hash(password, 10)
                });
                // Create JWT-token
                const token = jwt.sign({ user_id: user._id }, TOKEN_KEY, {
                    expiresIn: "2h"
                });
                user.token = token;
                // Return token
                res.status(201).json(user);
            }
            catch (e) {
                console.log(e);
                res.sendStatus(500);
            }
        }
    ],
    delete: async (req, res) => {
        // Delete user
    },
    login: async (req, res) => {
        try {
            // Validate username and password
            const { username, password } = req.body;
            if (!(username && password))
                return res.status(400).send('All inputs are required');
            // Check for existing user
            const oldUser = await User_1.default.findOne({ username });
            if (!oldUser)
                return res.status(404).send('User does\'nt exist');
            // Check if password is matching
            if (!bcrypt.compare(oldUser.password, password))
                return res.status(401).send('Incorrect password');
            // Create new JWT
            const token = jwt.sign({ user_id: oldUser._id, email: oldUser.email }, process.env.TOKEN_KEY, {
                expiresIn: "2h",
            });
            // Save JWT to user
            oldUser.token = token;
            oldUser.save();
            res.status(200).send(token);
        }
        catch (e) {
            console.log(e);
            res.sendStatus(500);
        }
    }
};
exports.default = User;
