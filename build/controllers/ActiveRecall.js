"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const getUserFromId_1 = __importDefault(require("../services/getUserFromId"));
const ActiveRecall = {
    createFlashcard: [
        (0, express_validator_1.check)('question', 'Question cannot be empty')
            .exists(),
        async (req, res) => {
            // Validate req
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(422).jsonp(errors.array());
            }
            // Get technique
            const { project_id, technique_id } = req.params;
            const user = await (0, getUserFromId_1.default)(req, res);
            const technique = user.projects.id(project_id).techniques.id(technique_id);
            if (!technique)
                return res.status(404).send('Could not find technique or project');
            // Get fields
            const { question, answer } = req.body;
            // Create flashcard
            const newFlashcard = technique.flashcards.create({
                question: question,
                answer: answer
            });
            technique.flashcards.push(newFlashcard);
            // Save user
            await user.save();
            // Return OK
            res.sendStatus(201);
        }
    ],
    removeFlashcard: async (req, res) => {
        const { project_id, technique_id, flashcard_id } = req.params;
        // Get technique
        const user = await (0, getUserFromId_1.default)(req, res);
        const technique = user.projects.id(project_id)?.techniques.id(technique_id);
        if (!technique)
            return res.status(404).send('Could not find technique or project');
        // Remove flashcard
        technique.flashcards = technique.flashcards.pull(flashcard_id);
        user.save((err) => {
            if (err)
                return res.status(500).send(err.message);
            res.sendStatus(200);
        });
    },
};
exports.default = ActiveRecall;
