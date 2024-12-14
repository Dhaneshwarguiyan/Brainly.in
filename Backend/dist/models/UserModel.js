"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
//User Schema
const userSchema = new mongoose_1.default.Schema({
    fullname: {
        type: String,
        // required:true
    },
    email: {
        type: String,
        unique: true,
        // required:true
    },
    username: {
        type: String,
        required: true,
        // unique:true
    },
    password: {
        type: String,
        required: true
    },
}, { timestamps: true });
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;