"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const getUserFromId_1 = __importDefault(require("../services/getUserFromId"));
const Technique = {
    getAll: async (req, res) => {
        const project_id = req.params.id;
        const user = await (0, getUserFromId_1.default)(req, res);
        // Get techniques in project
        const project = user.projects.id(project_id);
        if (!project)
            return res.status(404).send("Could not find project");
        const techniques = project.techniques;
        res.status(200).json(techniques);
    },
    getFromId: async (req, res) => {
        const project_id = req.params.project_id;
        const technique_id = req.params.technique_id;
        const user = await (0, getUserFromId_1.default)(req, res);
        // Get techniques in project
        const project = user.projects.id(project_id);
        if (!project)
            return res.status(404).send("Could not find project");
        const technique = project.techniques.id(technique_id);
        if (!technique)
            return res.status(404).send("Could not find technique");
        res.status(200).json(technique);
    },
    create: [
        (0, express_validator_1.check)('type', 'Type is not valid')
            .exists()
            .isIn(['spaced_repetition', 'active_recall']),
        async (req, res) => {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(422).jsonp(errors.array());
            }
            const project_id = req.params.id;
            const user = await (0, getUserFromId_1.default)(req, res);
            const { type } = req.body;
            // Get project with id
            const project = user.projects.id(project_id);
            if (!project)
                return res.status(404).send("Could not find project");
            // Create new technique
            const newTechnique = project.techniques.create({
                techniqueType: type
            });
            project.techniques.push(newTechnique);
            user.save();
            res.status(201).json(newTechnique);
        }
    ]
};
exports.default = Technique;
