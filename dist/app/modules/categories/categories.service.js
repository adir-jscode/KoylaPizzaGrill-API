"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const categories_model_1 = require("./categories.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createCategory = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield categories_model_1.Category.create(payload);
    return category;
});
const getCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield categories_model_1.Category.find();
    return categories;
});
const getCategoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryById = yield categories_model_1.Category.findById(id);
    if (!categoryById) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Category not found");
    }
    return categoryById;
});
const updateCategory = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const isCategoryExists = yield categories_model_1.Category.findById(id);
    if (!isCategoryExists) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Category not found");
    }
    const updated = yield categories_model_1.Category.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    return updated;
});
const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isCategoryExists = yield categories_model_1.Category.findById(id);
    if (!isCategoryExists) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Category not found");
    }
    yield categories_model_1.Category.findByIdAndDelete(id);
});
exports.CategoryService = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
