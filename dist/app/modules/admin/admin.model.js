"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const mongoose_1 = require("mongoose");
const adminSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    last_login: { type: Date },
    password: { type: String },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Admin = (0, mongoose_1.model)("Admin", adminSchema);
