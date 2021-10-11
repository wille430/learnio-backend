"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const Project_1 = require("../models/Project");
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: { type: String },
    token: { type: String },
    projects: [Project_1.projectSchema]
});
exports.default = mongoose.model("user", userSchema);
