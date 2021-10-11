"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getUserFromId_1 = __importDefault(require("../services/getUserFromId"));
const Project = {
    create: async (req, res) => {
        // Validate req
        const { title, selectedTechniques } = req.body;
        if (!(title && selectedTechniques) || !Array.isArray(selectedTechniques))
            return res.status(400).send('Missing required fields');
        // Get user and create new project
        const user = await (0, getUserFromId_1.default)(req, res);
        const newProject = user.projects.create({
            title: title,
            selectedTechniques: selectedTechniques
        });
        user.projects.push(newProject);
        await user.save();
        // Return OK
        res.status(201).json(newProject);
    },
    delete: async (req, res) => {
        const user = await (0, getUserFromId_1.default)(req, res);
        const project_id = req.params.id;
        user.projects = user.projects.pull(project_id);
        user.save();
        res.sendStatus(200);
    },
    getAll: async (req, res) => {
        const user = await (0, getUserFromId_1.default)(req, res);
        // Get user projects and return
        const projects = user.projects;
        res.status(200).json(projects);
    },
};
exports.default = Project;
