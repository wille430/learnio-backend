"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const getUserFromId = async (req, res) => {
    const { user_id } = req.user;
    // Find user in db
    const user = await User_1.default.findOne({ _id: user_id });
    if (!user)
        return res.status(404).send('User not found');
    return user;
};
exports.default = getUserFromId;
