"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = require("mongoose");
const categories_interface_1 = require("./categories.interface");
const CategorySchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    display: { type: Boolean, default: true },
    available: [{ type: String, enum: Object.values(categories_interface_1.Available) }],
    availableDays: [Number],
    availableTime: {
        from: String,
        to: String,
    },
    displayOrder: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Category = (0, mongoose_1.model)("Category", CategorySchema);
