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
        (0, express_validator_1.check)('username')
            .exists()
            .withMessage('Username cannot be empty')
            .isLength({ min: 3 })
            .withMessage('Username must be at least 3 characters long')
            .custom(async (username) => {
            const usernameExists = await User.isFieldInUse('username', username);
            if (usernameExists) {
                throw new Error('Username is already taken');
            }
            else {
                return true;
            }
        }),
        (0, express_validator_1.check)('password')
            .exists()
            .withMessage('Password cannot be empty')
            .isStrongPassword()
            .withMessage('Password to weak'),
        (0, express_validator_1.check)('repassword')
            .custom(async (repassword, { req }) => {
            const { password } = req.body;
            if (!(password === repassword))
                throw new Error('The passwords must match!');
        }),
        async (req, res) => {
            // Validate input
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(422).jsonp(errors.array());
            }
            try {
                // Get and validate input
                const { username, password } = req.body;
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
    login: [
        (0, express_validator_1.check)('username')
            .exists()
            .withMessage('Username cannot be empty')
            .custom(async (username) => {
            const userExists = await User.isFieldInUse('username', username);
            if (!userExists) {
                throw new Error('Invalid password or username');
            }
            else {
                return true;
            }
        }),
        (0, express_validator_1.check)('password')
            .exists()
            .withMessage('Password cannot be empty')
            .custom(async (password, { req }) => {
            const validPassword = await User.isValidPassword(req.body.username, password);
            if (!validPassword) {
                throw new Error('Invalid password or username');
            }
            else {
                return false;
            }
        }),
        async (req, res) => {
            // Validate input
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(422).jsonp(errors.array());
            }
            try {
                // Validate username and password
                const { username, password } = req.body;
                // Get existing user
                const user = await User_1.default.findOne({ username });
                // Create new JWT
                const token = jwt.sign({ user_id: user._id, email: user.email }, process.env.TOKEN_KEY, {
                    expiresIn: "2h",
                });
                // Save JWT to user
                user.token = token;
                user.save();
                res.status(200).send(token);
            }
            catch (e) {
                console.log(e);
                res.sendStatus(500);
            }
        }
    ],
    isFieldInUse: async (field, value) => {
        // Check for existing user
        const oldUser = await User_1.default.findOne({ [field]: value });
        return !!oldUser;
    },
    isValidPassword: async (username, password) => {
        // Check for existing user
        const user = await User_1.default.findOne({ username });
        if (!user)
            return false;
        // Compare passwords
        return await await bcrypt.compare(password, user.password);
    },
    validateToken: async (req, res) => {
        const { token } = req.body;
        if (!token)
            return res.sendStatus(400);
        jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            res.sendStatus(200);
        });
    },
};
exports.default = User;
