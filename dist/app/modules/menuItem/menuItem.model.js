"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuItem = void 0;
const mongoose_1 = require("mongoose");
const AddonSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
});
const PrimaryOptionSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    options: [
        {
            name: { type: String, required: true },
            price: { type: Number, default: 0 },
        },
    ],
});
const SecondaryOptionSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    minSelect: { type: Number, required: true },
    maxSelect: { type: Number, required: true },
    options: [
        {
            name: { type: String, required: true },
            price: { type: Number, default: 0 },
        },
    ],
});
const MenuItemSchema = new mongoose_1.Schema({
    categoryId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    price: { type: Number, required: true },
    primaryOption: { type: PrimaryOptionSchema, required: true },
    secondaryOptions: { type: [SecondaryOptionSchema], default: [] },
    addons: { type: [AddonSchema], default: [] },
    tags: { type: [String], default: [] },
    isAvailable: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
}, { timestamps: true, versionKey: false });
exports.MenuItem = (0, mongoose_1.model)("MenuItem", MenuItemSchema);
